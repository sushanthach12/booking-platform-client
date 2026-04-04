export async function parseApiError(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (body && typeof body === "object") {
      const o = body as Record<string, unknown>;
      const msg = o.message;
      const err = o.error;
      if (typeof msg === "string") return msg;
      if (typeof err === "string") return err;
    }
  } catch {
    /* ignore */
  }
  return res.statusText || fallback;
}
