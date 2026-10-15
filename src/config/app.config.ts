export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
};

export const appConfig = {
  cookieBaseName: import.meta.env.VITE_COOKIE_BASE_NAME ?? "app",
};

// RTE open data (data.rte-france.com) — Actual Generation API.
// `identifier` is the RTE URL-safe base64 API key (`base64(client_id:client_secret)`),
// sent as an HTTP Basic header on the OAuth2 token endpoint (POST /token/oauth/);
// data calls then use the returned Bearer token (see src/api/generation.ts).
export const rteConfig = {
  identifier: import.meta.env.VITE_RTE_IDENTIFIER ?? "",
  baseURL: import.meta.env.VITE_RTE_BASE_URL ?? "https://digital.iservices.rte-france.com",
};
