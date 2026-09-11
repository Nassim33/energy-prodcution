/**
 * Reads a single cookie value by name from document.cookie.
 * Returns undefined if the cookie isn't set.
 */
export function getCookie(name: string): string | undefined {
  const prefix = `${name}=`;
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined;
}
