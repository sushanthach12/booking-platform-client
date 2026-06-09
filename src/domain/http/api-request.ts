import { parseApiError } from "./api-error";
import { apiFetch } from "./api-fetch";

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";
const NETWORK_MESSAGE =
  "We couldn't reach the server. Check your connection and try again.";

/**
 * Error thrown by {@link request} / {@link requestVoid} for any failed API
 * call. Carries the HTTP `statusCode` (`0` for network failures) and a
 * `message` that is always safe to surface to the user.
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions extends RequestInit {
  /** User-facing message used when the server provides none. */
  fallbackMessage?: string;
  /** Use the auth-aware fetch (JWT attach + silent 401 refresh). Default `true`. */
  auth?: boolean;
  /** HTTP statuses resolved to `null` instead of throwing (e.g. `[404]`). */
  nullOn?: number[];
}

/**
 * Runs the fetch and applies uniform error handling. Returns the `Response`
 * on success, or `null` when the status is listed in `nullOn`. Never lets a
 * raw network/HTTP failure escape — those become {@link ApiError}. An
 * `AbortError` is re-thrown untouched so callers can detect cancellation.
 */
async function send(
  url: string,
  {
    fallbackMessage = DEFAULT_MESSAGE,
    auth = true,
    nullOn,
    ...init
  }: RequestOptions,
): Promise<Response | null> {
  const doFetch = auth ? apiFetch : fetch;

  let res: Response;
  try {
    res = await doFetch(url, init);
  } catch (err) {
    // Propagate explicit cancellations so sagas/effects can identify them.
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    // fetch only rejects on network/CORS failure — never on HTTP status.
    throw new ApiError(0, NETWORK_MESSAGE);
  }

  if (nullOn?.includes(res.status)) return null;

  if (!res.ok) {
    throw new ApiError(res.status, await parseApiError(res, fallbackMessage));
  }

  return res;
}

/**
 * Performs a JSON API request and returns the parsed response body (the full
 * `{ data, meta? }` envelope — extract what you need at the call site).
 *
 * Centralizes error handling so callers never see raw network or JSON-parse
 * failures: every failure becomes a friendly {@link ApiError}. Returns `null`
 * for any status listed in `options.nullOn` (e.g. `[404]`).
 */
export async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const res = await send(url, options);
  if (res === null) return null as T;
  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError(res.status, options.fallbackMessage ?? DEFAULT_MESSAGE);
  }
}

/**
 * Like {@link request} but for endpoints that return no meaningful body
 * (fire-and-forget mutations). Resolves on success; throws {@link ApiError}
 * on failure. The response body, if any, is left unread.
 */
export async function requestVoid(
  url: string,
  options: RequestOptions = {},
): Promise<void> {
  await send(url, options);
}
