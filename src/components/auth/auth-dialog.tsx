"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  LoginCredentials,
  SignupCredentials,
} from "@/data/interfaces/auth.interface";
import { getAuthUseCase } from "@/domain/di";
import { useMemo, useState } from "react";
import GoogleIcon from "../shared/icons/google";
import { Modal } from "../shared/modal";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");

  const title =
    mode === "login"
      ? "Log in"
      : mode === "signup"
        ? "Sign up"
        : "Reset password";

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-md">
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body className="pb-6">
        {mode === "login" && (
          <LoginForm
            onModeChange={setMode}
            onClose={() => onOpenChange(false)}
          />
        )}
        {mode === "signup" && (
          <SignupForm
            onModeChange={setMode}
            onClose={() => onOpenChange(false)}
          />
        )}
        {mode === "reset" && (
          <ResetForm
            onModeChange={setMode}
            onClose={() => onOpenChange(false)}
          />
        )}
      </Modal.Body>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Shared post-auth redirect helper
// ---------------------------------------------------------------------------
function handlePostAuth(onClose: () => void) {
  onClose();
  const redirectPath = sessionStorage.getItem("redirectAfterLogin");
  if (redirectPath) {
    sessionStorage.removeItem("redirectAfterLogin");
    window.location.href = redirectPath;
  } else {
    window.location.reload();
  }
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
function LoginForm({
  onModeChange,
  onClose,
}: {
  onModeChange: (mode: "login" | "signup" | "reset") => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const authUseCase = useMemo(() => getAuthUseCase(), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      const credentials: LoginCredentials = {
        email: fd.get("email") as string,
        password: fd.get("password") as string,
      };
      const authResponse = await authUseCase.login(credentials);
      authUseCase.saveAuthData(authResponse);
      handlePostAuth(onClose);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const authResponse = await authUseCase.socialLogin("google");
      authUseCase.saveAuthData(authResponse);
      handlePostAuth(onClose);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          className="w-full rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? "Logging in…" : "Log in"}
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

      <Button
        variant="outline"
        className="w-full rounded-lg p-6"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <GoogleIcon className="mr-2 size-5" />
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => onModeChange("signup")}
          className="text-primary hover:underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Signup
// ---------------------------------------------------------------------------
function SignupForm({
  onModeChange,
  onClose,
}: {
  onModeChange: (mode: "login" | "signup" | "reset") => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const authUseCase = useMemo(() => getAuthUseCase(), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      const credentials: SignupCredentials = {
        firstName: fd.get("firstName") as string,
        lastName: fd.get("lastName") as string,
        email: fd.get("email") as string,
        password: fd.get("password") as string,
      };
      const authResponse = await authUseCase.signup(credentials);
      authUseCase.saveAuthData(authResponse);
      handlePostAuth(onClose);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError("");
    try {
      const authResponse = await authUseCase.socialLogin("google");
      authUseCase.saveAuthData(authResponse);
      handlePostAuth(onClose);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="signup-firstName">First Name</Label>
            <Input
              id="signup-firstName"
              name="firstName"
              type="text"
              placeholder="First name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="signup-lastName">Last Name</Label>
            <Input
              id="signup-lastName"
              name="lastName"
              type="text"
              placeholder="Last name"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="Email"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            placeholder="Password"
            required
            disabled={isLoading}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="space-y-2 flex flex-col">
          <Button
            type="submit"
            className="w-full rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Signing up…" : "Sign up"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
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

      <Button
        variant="outline"
        className="w-full rounded-lg p-4"
        onClick={handleGoogleSignup}
        disabled={isLoading}
      >
        <GoogleIcon className="mr-2 size-4" />
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className="text-primary hover:underline"
        >
          Log in
        </button>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reset password
// ---------------------------------------------------------------------------
function ResetForm({
  onModeChange,
}: {
  onModeChange: (mode: "login" | "signup" | "reset") => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const authUseCase = useMemo(() => getAuthUseCase(), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      await authUseCase.forgotPassword(fd.get("email") as string);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Check your inbox — we&apos;ve sent a reset link.
        </p>
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className="text-sm text-primary hover:underline"
        >
          Back to log in
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          disabled={isLoading}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={isLoading}
        >
          {isLoading ? "Sending…" : "Send reset link"}
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
