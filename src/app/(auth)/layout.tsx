/**
 * Auth route group: email-linked pages that must exist as real URLs.
 * URLs: /forgot-password, /reset-password
 * Sign in / sign up use the AuthDialog modal — no separate pages.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen">{children}</div>;
}
