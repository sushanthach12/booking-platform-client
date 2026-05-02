import { getAuthUseCase } from "@/domain/di";
import { COOKIE_KEYS, getCookie } from "./cookies";

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function drainQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

/**
 * Drop-in replacement for `fetch` that:
 *  1. Attaches the JWT from cookies as `Authorization: JWT <token>`
 *  2. On 401, attempts a single silent token refresh
 *  3. Retries the original request with the new token
 *  4. On refresh failure, redirects to /signin
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);

  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `JWT ${token}`);
  }

  const res = await fetch(input, { ...init, headers });

  if (res.status !== 401) return res;

  // ── 401 path: try to refresh ──────────────────────────────────────
  if (isRefreshing) {
    return new Promise<Response>((resolve) => {
      refreshQueue.push(async (newToken) => {
        if (!newToken) {
          resolve(res);
          return;
        }
        const retryHeaders = new Headers(init.headers);
        retryHeaders.set("Authorization", `JWT ${newToken}`);
        resolve(await fetch(input, { ...init, headers: retryHeaders }));
      });
    });
  }

  isRefreshing = true;
  const authUseCase = getAuthUseCase();
  const newToken = await authUseCase.refreshToken();
  isRefreshing = false;

  if (!newToken) {
    drainQueue(null);
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
    return res;
  }

  drainQueue(newToken);

  const retryHeaders = new Headers(init.headers);
  retryHeaders.set("Authorization", `JWT ${newToken}`);
  return fetch(input, { ...init, headers: retryHeaders });
}
