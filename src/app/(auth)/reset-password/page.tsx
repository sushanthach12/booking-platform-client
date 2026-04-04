import ResetPasswordTemplate from "@/components/auth/templates/reset-password-template";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">Loading…</p>}
    >
      <ResetPasswordTemplate />
    </Suspense>
  );
}
