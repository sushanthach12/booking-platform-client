"use client";

import { getAuthUseCase } from "@/domain/di";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { SignInView } from "../sign-in-view";

export default function SignInTemplate() {
  const router = useRouter();
  const authUseCase = useMemo(() => getAuthUseCase(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsLoading(true);
      try {
        const response = await authUseCase.login({ email, password });
        authUseCase.saveAuthData(response);
        const redirect = sessionStorage.getItem("redirectAfterLogin");
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirect || "/");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign in failed");
      } finally {
        setIsLoading(false);
      }
    },
    [authUseCase, router],
  );

  return (
    <SignInView
      onSubmit={(email, password) => {
        void handleSubmit(email, password);
      }}
      isLoading={isLoading}
      error={error}
    />
  );
}
