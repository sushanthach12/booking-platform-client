import 'reflect-metadata';
import { injectable } from 'tsyringe';
import type {
  AuthResponse,
  IAuthRepository,
  LoginCredentials,
  SignupCredentials,
  User,
} from '../interfaces/auth.interface';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

/** Shape returned by every auth endpoint: { data: { user, accessToken } } */
interface ApiAuthPayload {
  data: {
    user: User;
    accessToken: string;
  };
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body?.message ?? body?.error ?? fallback;
  } catch {
    return res.statusText || fallback;
  }
}

@injectable()
export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      throw new Error(await parseError(res, 'Login failed'));
    }

    const { data }: ApiAuthPayload = await res.json();
    return { user: data.user, token: data.accessToken };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      throw new Error(await parseError(res, 'Signup failed'));
    }

    const { data }: ApiAuthPayload = await res.json();
    return { user: data.user, token: data.accessToken };
  }

  async resetPassword(email: string): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      throw new Error(await parseError(res, 'Password reset failed'));
    }
  }

  async socialLogin(
    provider: 'google' | 'facebook' | 'apple',
    email?: string,
  ): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/social/${provider}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      throw new Error(await parseError(res, `${provider} login failed`));
    }

    const { data }: ApiAuthPayload = await res.json();
    return { user: data.user, token: data.accessToken };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return null;

      const body: { data: { user: User } } = await res.json();
      return body.data.user;
    } catch {
      return null;
    }
  }

  async logout(token: string): Promise<void> {
    // Best-effort: clear server session; local cookies are cleared by the use-case
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
}
