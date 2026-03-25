'use client';

import type { User } from '@/data/interfaces/auth.interface';
import { COOKIE_KEYS, getCookie } from '@/lib/utils/cookies';
import { useState } from 'react';

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

/**
 * Reads auth state from cookies on the client.
 * Uses a lazy useState initializer so the value is available on the first
 * render without an effect, avoiding cascading re-renders.
 */
export function useAuth(): AuthState {
  const [state] = useState<AuthState>(readAuthFromCookies);
  return state;
}
