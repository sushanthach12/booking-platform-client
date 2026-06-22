// Server-only: importing `next/headers` makes this module fail to compile if
// pulled into a Client Component, so no extra guard is needed.
import { headers } from "next/headers";

/**
 * Cloudflare / proxy headers worth propagating from the incoming browser
 * request onto our server-side (SSR) API calls. When SSR hits the API origin
 * directly (bypassing Cloudflare) these carry the real client's IP, geo and
 * protocol so the backend still sees the visitor — not the deploy host.
 */
const FORWARDED_HEADERS = [
  "cf-connecting-ip",
  "cf-ipcountry",
  "cf-ray",
  "cf-visitor",
  "x-forwarded-for",
  "x-forwarded-proto",
] as const;

/** Sensible defaults for headers a direct call would otherwise lack. */
const DEFAULTS: Partial<Record<(typeof FORWARDED_HEADERS)[number], string>> = {
  "cf-visitor": '{"scheme":"https"}',
  "x-forwarded-proto": "https",
};

/**
 * Reads the current request's Cloudflare/proxy headers (server-only) so they
 * can be forwarded to a server-side API call. Returns a plain header map ready
 * to spread into a `fetch` `headers` option. Safe to call only within a Server
 * Component / Route Handler / server action (it relies on `next/headers`).
 */
export async function getForwardedHeaders(): Promise<Record<string, string>> {
  const incoming = await headers();
  const out: Record<string, string> = {};

  for (const key of FORWARDED_HEADERS) {
    const value = incoming.get(key) ?? DEFAULTS[key];
    if (value) out[key] = value;
  }

  return out;
}
