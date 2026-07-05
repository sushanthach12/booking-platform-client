"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  LoginCredentials,
  OtpContext,
  SignupCredentials,
} from "@/domain/entities";
import { getAuthUseCase } from "@/domain/di";
import {
  GOOGLE_LOGIN_ENABLED,
  GoogleAuthProvider,
} from "@/components/providers/google-auth-provider";
import { toastSuccess } from "@/lib/utils/toast";
import { GoogleLogin } from "@react-oauth/google";
import { useMemo, useState } from "react";
import { Modal } from "../shared/modal";
import { OtpVerificationForm } from "./otp-verification-form";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthMode = "login" | "signup" | "reset" | "otp";

/** Set when login/signup succeeds and we're waiting on the emailed code. */
interface PendingOtp {
  email: string;
  context: OtpContext;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [pendingOtp, setPendingOtp] = useState<PendingOtp | null>(null);

  const title =
    mode === "login"
      ? "Log in"
      : mode === "signup"
        ? "Sign up"
        : mode === "otp"
          ? "Check your email"
          : "Reset password";

  const startOtpStep = (email: string, context: OtpContext) => {
    setPendingOtp({ email, context });
    setMode("otp");
  };

  return (
    <GoogleAuthProvider>
      <Modal open={open} onOpenChange={onOpenChange} className="max-w-md">
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body className="pb-6">
          {mode === "login" && (
            <LoginForm
              onModeChange={setMode}
              onOtpRequired={(email) => startOtpStep(email, "login")}
              onClose={() => onOpenChange(false)}
            />
          )}
          {mode === "signup" && (
            <SignupForm
              onModeChange={setMode}
              onOtpRequired={(email) => startOtpStep(email, "signup")}
              onClose={() => onOpenChange(false)}
            />
          )}
          {mode === "reset" && (
            <ResetForm
              onModeChange={setMode}
              onClose={() => onOpenChange(false)}
            />
          )}
          {mode === "otp" && pendingOtp && (
            <OtpVerificationForm
              email={pendingOtp.email}
              context={pendingOtp.context}
              onSuccess={() => handlePostAuth(() => onOpenChange(false))}
              onBack={() => {
                setMode(pendingOtp.context);
                setPendingOtp(null);
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </GoogleAuthProvider>
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
  onOtpRequired,
  onClose,
}: {
  onModeChange: (mode: AuthMode) => void;
  onOtpRequired: (email: string) => void;
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
      // No tokens yet — the session is only issued after OTP verification.
      const challenge = await authUseCase.login(credentials);
      if (!challenge.otpRequired) {
        throw new Error("Could not send the verification code. Try again.");
      }
      toastSuccess(`We sent a 6-digit code to ${challenge.email}`);
      onOtpRequired(challenge.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setIsLoading(true);
    setError("");
    try {
      const authResponse = await authUseCase.socialLogin("google", credential);
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

      {GOOGLE_LOGIN_ENABLED && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <div className="mx-auto w-fit overflow-hidden rounded-lg">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  void handleGoogleLogin(credentialResponse.credential);
                } else {
                  setError("Google login failed");
                }
              }}
              onError={() => setError("Google login failed")}
              text="continue_with"
              size="large"
              width="400"
            />
          </div>
        </>
      )}

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
  onOtpRequired,
  onClose,
}: {
  onModeChange: (mode: AuthMode) => void;
  onOtpRequired: (email: string) => void;
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
      // The account is only created once the emailed OTP is verified.
      const challenge = await authUseCase.signup(credentials);
      if (!challenge.otpRequired) {
        throw new Error("Could not send the verification code. Try again.");
      }
      toastSuccess(`We sent a 6-digit code to ${challenge.email}`);
      onOtpRequired(challenge.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async (credential: string) => {
    setIsLoading(true);
    setError("");
    try {
      const authResponse = await authUseCase.socialLogin("google", credential);
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

      {GOOGLE_LOGIN_ENABLED && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <div className="mx-auto w-fit overflow-hidden rounded-lg">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  void handleGoogleSignup(credentialResponse.credential);
                } else {
                  setError("Google signup failed");
                }
              }}
              onError={() => setError("Google signup failed")}
              text="signup_with"
              size="large"
              width="400"
            />
          </div>
        </>
      )}

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
