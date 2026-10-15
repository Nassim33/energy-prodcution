import { apiConfig, appConfig } from "@/config/app.config";
import { getCookie } from "@/shared/utils/web";

export interface RequestConfig<TData = unknown> {
  url?: string;
  baseURL?: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: object;
  data?: TData | FormData;
  responseType?: "json" | "blob" | "text" | "arraybuffer";
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
  retry?: number;
}

export interface ResponseConfig<TData = unknown> {
  data: TData;
  status: number;
  statusText: string;
}

export type ResponseErrorConfig<TError = unknown> = ClientError<TError>;

export class ClientError<TError = unknown> extends Error {
  readonly response: ResponseConfig<TError>;
  readonly isClientError: boolean = true;

  constructor(message: string, response: ResponseConfig<TError>, options?: ErrorOptions) {
    super(message, options);
    this.name = "ClientError";
    this.response = response;
  }
}

const RETRY_STATUS_CODES = new Set([408, 429, 502, 503, 504]);
const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_RETRIES = 2;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function serializeBody<T>(data: T | FormData | undefined): BodyInit | undefined {
  if (data == null) return undefined;
  if (data instanceof FormData) return data;
  if (typeof data === "string") return data;
  return JSON.stringify(data);
}

function generateRequestId(): string {
  return crypto.randomUUID();
}

async function parseErrorBody<TError>(response: Response): Promise<TError> {
  const text = await response.text();
  try {
    return JSON.parse(text) as TError;
  } catch {
    return text as TError;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const client = async <TData, TError = unknown, TRequestData = unknown>(
  config: RequestConfig<TRequestData>,
  // eslint-disable-next-line sonarjs/cognitive-complexity
): Promise<ResponseConfig<TData>> => {
  const url = new URL(`${config.baseURL ?? apiConfig.baseURL}${config.url}`, location.origin);

  if (config.params) {
    for (const [key, value] of Object.entries(config.params)) {
      if (value == null) continue;
      if (Array.isArray(value)) {
        for (const item of value) url.searchParams.append(key, String(item));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const isFormData = config.data instanceof FormData;
  const maxRetries = config.retry ?? DEFAULT_RETRIES;
  const requestId = generateRequestId();

  const buildFetchOptions = (signal: AbortSignal): RequestInit => ({
    method: config.method,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(!isFormData && config.data != null && { "Content-Type": "application/json" }),
      "X-CSRFToken": getCookie(`${appConfig.cookieBaseName}-csrftoken`) ?? "",
      "X-Request-ID": requestId,
      ...config.headers,
    },
    body: serializeBody(config.data),
    signal,
  });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort("timeout");
    }, config.timeout ?? DEFAULT_TIMEOUT);

    // Combine external signal with internal timeout
    const combinedSignal = config.signal
      ? AbortSignal.any([config.signal, controller.signal])
      : controller.signal;

    try {
      const response = await fetch(url, buildFetchOptions(combinedSignal));
      clearTimeout(timeoutId);

      if (!response.ok) {
        const shouldRetry = RETRY_STATUS_CODES.has(response.status) && attempt < maxRetries;

        if (shouldRetry) {
          const delay = Math.min(1000 * 2 ** attempt, 10_000); // Exponential backoff, max 10s
          await sleep(delay);
          continue;
        }

        const errorData = await parseErrorBody<TError>(response);
        throw new ClientError(response.statusText || `HTTP ${response.status}`, {
          data: errorData,
          status: response.status,
          statusText: response.statusText,
        });
      }

      const responseType = config.responseType ?? "json";
      let data: TData;

      if (response.status === 204) {
        data = null as TData;
      } else
        switch (responseType) {
          case "json": {
            data = (await response.json()) as TData;

            break;
          }
          case "blob": {
            data = (await response.blob()) as TData;

            break;
          }
          case "text": {
            data = (await response.text()) as TData;

            break;
          }
          case "arraybuffer": {
            data = (await response.arrayBuffer()) as TData;

            break;
          }
          default: {
            data = (await response.json()) as TData;
          }
        }

      return { data, status: response.status, statusText: response.statusText };
    } catch (error) {
      clearTimeout(timeoutId);

      // Don't retry on user abort or client errors
      if (error instanceof ClientError) throw error;
      if (config.signal?.aborted) throw error;

      lastError = error as Error;

      // Retry on network errors / timeouts
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * 2 ** attempt, 10_000);
        await sleep(delay);
        continue;
      }
    }
  }

  // All retries exhausted
  throw new Error("Request failed after retries", { cause: lastError });
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export type Client = <TData, _TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
) => Promise<ResponseConfig<TData>>;

// eslint-disable-next-line import-x/no-default-export
export default client;
