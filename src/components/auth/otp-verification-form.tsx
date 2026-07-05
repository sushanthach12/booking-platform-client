"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { OtpContext } from "@/domain/entities";
import { getAuthUseCase } from "@/domain/di";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

/** Matches the backend's resend cooldown (60s between sends). */
const RESEND_COOLDOWN_SECONDS = 60;
const OTP_LENGTH = 6;

interface OtpVerificationFormProps {
  email: string;
  context: OtpContext;
  /** Called after the OTP is verified and the session is saved. */
  onSuccess: () => void;
  /** Return to the login/signup form (e.g. wrong email). */
  onBack: () => void;
}

/**
 * Step 2 of login/signup: collects the emailed 6-digit code and exchanges it
 * for the session. Tokens are only ever saved here — never before verification.
 */
export function OtpVerificationForm({
  email,
  context,
  onSuccess,
  onBack,
}: OtpVerificationFormProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [shakeKey, setShakeKey] = useState(0);
  const authUseCase = useMemo(() => getAuthUseCase(), []);
  const prefersReducedMotion = useReducedMotion();
  // The dialog can unmount mid-request (user closes it) — don't set state after.
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (submitted: string) => {
    if (submitted.length !== OTP_LENGTH || isVerifying) return;
    setIsVerifying(true);
    try {
      const authResponse = await authUseCase.verifyOtp(
        email,
        submitted,
        context,
      );
      authUseCase.saveAuthData(authResponse);
      toastSuccess(
        context === "signup"
          ? "Account created — welcome to Stayly"
          : "You're signed in",
      );
      onSuccess();
    } catch (err) {
      if (!mountedRef.current) return;
      toastError(err, "Verification failed. Please try again.");
      setCode("");
      setShakeKey((k) => k + 1);
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      await authUseCase.resendOtp(email, context);
      if (!mountedRef.current) return;
      toastSuccess(`New code sent to ${email}`);
      setCode("");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      if (!mountedRef.current) return;
      toastError(err, "Could not resend the code. Please try again.");
    } finally {
      if (mountedRef.current) setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code we sent to{" "}
        <span className="font-medium text-foreground">{email}</span>. The code
        expires in 10 minutes.
      </p>

      <motion.div
        key={shakeKey}
        animate={
          shakeKey > 0 && !prefersReducedMotion
            ? { x: [0, -8, 8, -5, 5, 0] }
            : undefined
        }
        transition={{ duration: 0.35 }}
        className="flex justify-center"
      >
        <InputOTP
          autoFocus
          maxLength={OTP_LENGTH}
          pattern={REGEXP_ONLY_DIGITS}
          value={code}
          onChange={setCode}
          onComplete={(value: string) => void handleVerify(value)}
          disabled={isVerifying}
          aria-label="6-digit verification code"
          containerClassName="gap-2"
        >
          <InputOTPGroup className="gap-2">
            {Array.from({ length: OTP_LENGTH }, (_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="h-13 w-11 rounded-xl border text-lg font-semibold first:rounded-l-xl last:rounded-r-xl"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </motion.div>

      <Button
        type="button"
        className="w-full rounded-lg"
        disabled={code.length !== OTP_LENGTH || isVerifying}
        onClick={() => void handleVerify(code)}
      >
        {isVerifying
          ? "Verifying…"
          : context === "signup"
            ? "Verify and create account"
            : "Verify and sign in"}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          disabled={isVerifying}
          className="text-muted-foreground hover:text-foreground hover:underline"
        >
          Use a different email
        </button>
        {cooldown > 0 ? (
          <span className="tabular-nums text-muted-foreground">
            Resend code in 0:{cooldown.toString().padStart(2, "0")}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={isResending}
            className="font-medium text-primary hover:underline disabled:opacity-50"
          >
            {isResending ? "Sending…" : "Resend code"}
          </button>
        )}
      </div>
    </div>
  );
}
