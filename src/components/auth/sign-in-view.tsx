"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Presentational sign-in form. State and handlers passed from SignInTemplate.
 */
interface SignInViewProps {
  /** Initial values from template (e.g. prefilled email) */
  initialEmail?: string;
  /** Submit handler from template (template will call API) */
  onSubmit?: (email: string, password: string) => void;
}

export function SignInView({ initialEmail = "", onSubmit }: SignInViewProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const email =
              (form.elements.namedItem("email") as HTMLInputElement)?.value ??
              "";
            const password =
              (form.elements.namedItem("password") as HTMLInputElement)
                ?.value ?? "";
            onSubmit?.(email, password);
          }}
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={initialEmail}
              placeholder="you@example.com"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline"
          >
            Sign up
          </Link>
        </p>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="underline">
            Forgot password?
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
