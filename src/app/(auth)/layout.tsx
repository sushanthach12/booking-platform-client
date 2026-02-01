/**
 * Auth route group: sign in, sign up, forgot/reset password.
 * URLs: /signin, /signup, /forgot-password, /reset-password
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      {children}
    </div>
  );
}
