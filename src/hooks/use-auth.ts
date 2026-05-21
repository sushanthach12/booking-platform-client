"use client";

import type { User } from "@/domain/entities";
import { AUTH_CHANGE_EVENT, COOKIE_KEYS, getCookie } from "@/lib/utils/cookies";
import { useEffect, useState } from "react";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

function readAuthFromCookies(): AuthState {
  const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);
  const userStr = getCookie(COOKIE_KEYS.AUTH_USER);
  if (!token || !userStr) return { user: null, isAuthenticated: false };
  try {
    return { user: JSON.parse(userStr) as User, isAuthenticated: true };
  } catch {
    return { user: null, isAuthenticated: false };
  }
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(readAuthFromCookies());

  useEffect(() => {
    const handler = () => setState(readAuthFromCookies());
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  }, []);

  return state;
}
