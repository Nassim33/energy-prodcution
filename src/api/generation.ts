import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { rteConfig } from "@/config/app.config";
import { actualGenerationSchema, type ActualGeneration } from "@/schemas/generation";

const TOKEN_PATH = "/token/oauth/";
const GENERATION_PATH = "/open_api/actual_generation/v1/actual_generations_per_production_type";
const TOKEN_REFRESH_MARGIN_MS = 5 * 60_000;

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const { data } = await client<{ access_token?: string; expires_in?: number }>({
    url: TOKEN_PATH,
    baseURL: rteConfig.baseURL,
    method: "POST",
    headers: {
      Authorization: `Basic ${rteConfig.identifier}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  });

  const accessToken = data?.access_token;
  if (!accessToken)
    throw new Error(
      "RTE: impossible d'obtenir un jeton d'accès (clé invalide ou compte non activé).",
    );

  cachedToken = {
    value: accessToken,
    expiresAt: Date.now() + ((data.expires_in ?? 3600) * 1000 - TOKEN_REFRESH_MARGIN_MS),
  };
  return accessToken;
}

export const generationKeys = {
  all: ["generation"] as const,
  weekly: (startDate: string, endDate: string) =>
    ["generation", "weekly", startDate, endDate] as const,
};

async function fetchActualGeneration(
  startDate: string,
  endDate: string,
  signal?: AbortSignal,
): Promise<ActualGeneration> {
  const token = await getAccessToken();
  const { data } = await client<unknown>({
    url: GENERATION_PATH,
    baseURL: rteConfig.baseURL,
    method: "GET",
    params: { start_date: startDate, end_date: endDate },
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  return actualGenerationSchema.parse(data);
}

export function useActualGenerationQuery(startDate: string, endDate: string) {
  return useQuery({
    queryKey: generationKeys.weekly(startDate, endDate),
    queryFn: ({ signal }) => fetchActualGeneration(startDate, endDate, signal),
    refetchInterval: 60_000,
  });
}
