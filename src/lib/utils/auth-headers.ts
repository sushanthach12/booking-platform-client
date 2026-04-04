import { COOKIE_KEYS, getCookie } from "./cookies";

export function getAuthHeaders(): Record<string, string> {
  const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getJsonHeaders(): Record<string, string> {
  return { "Content-Type": "application/json", ...getAuthHeaders() };
}
