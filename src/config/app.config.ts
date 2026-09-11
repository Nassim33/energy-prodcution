export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
};

export const appConfig = {
  cookieBaseName: import.meta.env.VITE_COOKIE_BASE_NAME ?? "app",
};
