"use client";

import { SignInView } from "../sign-in-view";

/**
 * Parent template for sign-in page.
 * - Owns: auth state, API call (signIn), data utils. Passes state/handlers to SignInView.
 * Page renders only layout + this template.
 */
export default function SignInTemplate() {
  const handleSubmit = (email: string, password: string) => {
    // TODO: call auth use-case / API from here
    console.log("Sign in", { email, password: "***" });
  };

  return <SignInView onSubmit={handleSubmit} />;
}
