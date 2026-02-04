"use client";

import { useState } from "react";
import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService, type LoginCredentials, type SignupCredentials } from "@/services/auth.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {mode === "login" && "Log in"}
              {mode === "signup" && "Sign up"}
              {mode === "reset" && "Reset password"}
            </DialogTitle>
            <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
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
      </DialogContent>
    </Dialog>
  );
}

function LoginForm({ onModeChange, onClose }: { onModeChange: (mode: "login" | "signup" | "reset") => void; onClose: () => void }) {
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
      // Optional: trigger page reload or state update
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
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
        <div className="space-y-2">
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
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
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
          className="w-full rounded-full"
          onClick={async () => {
            setIsLoading(true);
            try {
              await authService.socialLogin('google');
              onClose();
              window.location.reload();
            } catch (err) {
              setError("Google login failed");
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
        >
          Continue with Google
        </Button>
        <Button 
          variant="outline" 
          className="w-full rounded-full"
          onClick={async () => {
            setIsLoading(true);
            try {
              await authService.socialLogin('facebook');
              onClose();
              window.location.reload();
            } catch (err) {
              setError("Facebook login failed");
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
        >
          Continue with Facebook
        </Button>
        <Button 
          variant="outline" 
          className="w-full rounded-full"
          onClick={async () => {
            setIsLoading(true);
            try {
              await authService.socialLogin('apple');
              onClose();
              window.location.reload();
            } catch (err) {
              setError("Apple login failed");
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
        >
          Continue with Apple
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
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

function SignupForm({ onModeChange, onClose }: { onModeChange: (mode: "login" | "signup" | "reset") => void; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First name"
            className="rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Last name"
            className="rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </div>
        <Button type="submit" className="w-full rounded-full bg-primary py-3 text-primary-foreground hover:bg-primary/90">
          Sign up
        </Button>
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
        <Button variant="outline" className="w-full rounded-full py-3">
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full rounded-full py-3">
          Continue with Facebook
        </Button>
        <Button variant="outline" className="w-full rounded-full py-3">
          Continue with Apple
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

function ResetForm({ onModeChange, onClose }: { onModeChange: (mode: "login" | "signup" | "reset") => void; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button type="submit" className="w-full rounded-full bg-primary py-3 text-primary-foreground hover:bg-primary/90">
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
