"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  authService,
  type LoginCredentials
} from "@/services/auth.service";
import { useMemo, useState } from "react";
import GoogleIcon from "../shared/icons/google";
import { Modal } from "../shared/modal";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");

  const title = useMemo(() => {
    return mode === "login" ? "Log in" : mode === "signup" ? "Sign up" : "Reset password";
  }, [mode]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <div>
        {mode === "login" && (
          <LoginForm onModeChange={setMode} onClose={() => onOpenChange(false)} />
        )}
        {mode === "signup" && (
          <SignupForm onModeChange={setMode} onClose={() => onOpenChange(false)} />
        )}
        {mode === "reset" && (
          <ResetForm onModeChange={setMode} onClose={() => onOpenChange(false)} />
        )}
      </div>
    </Modal>
  );
}

function LoginForm({
  onModeChange,
  onClose,
}: {
  onModeChange: (mode: "login" | "signup" | "reset") => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const credentials: LoginCredentials = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      await authService.login(credentials);
      onClose();

      // Check for redirect path
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectPath;
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.socialLogin("google");
      onClose();

      // Check for redirect path
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectPath;
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>
        {error && <div className="text-sm text-destructive">{error}</div>}
        <Button
          type="submit"
          className="w-full rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => onModeChange("reset")}
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full rounded-lg p-6 hover:cursor-pointer"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <GoogleIcon className="mr-2 size-5" />
          Continue with Google
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => onModeChange("signup")}
          className="text-primary hover:underline"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

function SignupForm({
  onModeChange,
  onClose,
}: {
  onModeChange: (mode: "login" | "signup" | "reset") => void;
  onClose: () => void;
}) {
  const [error, setError] = useState("");

  const handleGoogleSignup = async () => {
    try {
      await authService.socialLogin("google");
      onClose();

      // Check for redirect path
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectPath;
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError("Google signup failed");
    }
  };

  return (
    <div className="space-y-4">
      <form className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              placeholder="First name"
              className="rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              placeholder="Last name"
              className="rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <Button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 text-primary-foreground hover:cursor-pointer hover:bg-primary/90"
          >
            Sign up
          </Button>
          <div className="text-xs text-muted-foreground text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full rounded-lg p-4 hover:cursor-pointer"
          onClick={handleGoogleSignup}
          disabled={false}
        >
          <GoogleIcon className="mr-2 size-4" />
          Continue with Google
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className="text-primary hover:underline"
        >
          Log in
        </button>
      </div>
    </div>
  );
}

function ResetForm({
  onModeChange,
  onClose,
}: {
  onModeChange: (mode: "login" | "signup" | "reset") => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>
      <form className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button
          type="submit"
          className="w-full rounded-full bg-primary py-3 text-primary-foreground hover:bg-primary/90"
        >
          Send reset link
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className="text-sm text-primary hover:underline"
        >
          Back to log in
        </button>
      </div>
    </div>
  );
}
