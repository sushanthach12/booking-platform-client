"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/** True when a Google client id is configured — gate `<GoogleLogin>` on this. */
export const GOOGLE_LOGIN_ENABLED = Boolean(GOOGLE_CLIENT_ID);

/**
 * Wraps the app with Google's OAuth context so `<GoogleLogin>` can render.
 * If the client id is not configured, renders children unchanged — the rest of
 * the app keeps working and only the Google button is unavailable.
 */
export function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!GOOGLE_CLIENT_ID) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
