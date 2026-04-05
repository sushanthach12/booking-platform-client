import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  User,
} from "@/domain/entities";
import type { IAuthRepository } from "@/domain/interfaces";
import { parseApiError } from "@/lib/utils/api-error";
import "reflect-metadata";
import { injectable } from "tsyringe";

interface ApiUserPayload {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface ApiAuthPayload {
  data: {
    user: ApiUserPayload;
    accessToken: string;
  };
}

function mapApiUser(u: ApiUserPayload): User {
  const name = u.name?.trim() ?? "";
  const parts = name.split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") || firstName || "";
  const role = (u.role ?? "").toLowerCase();
  return {
    id: u.id,
    email: u.email,
    firstName,
    lastName,
    isHost: role === "host",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

@injectable()
export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.AUTH.LOGIN), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Login failed"));
    }

    const { data }: ApiAuthPayload = await res.json();
    return {
      user: mapApiUser(data.user),
      token: data.accessToken,
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const name = `${credentials.firstName} ${credentials.lastName}`.trim();
    const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.AUTH.REGISTER), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        name: name || credentials.email,
      }),
    });

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Signup failed"));
    }

    const { data }: ApiAuthPayload = await res.json();
    return {
      user: mapApiUser(data.user),
      token: data.accessToken,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.AUTH.FORGOT_PASSWORD),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    if (!res.ok) {
      throw new Error(
        await parseApiError(res, "Password reset request failed"),
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.AUTH.RESET_PASSWORD),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Password reset failed"));
    }
  }

  async socialLogin(
    provider: "google" | "facebook" | "apple",
    email?: string,
  ): Promise<AuthResponse> {
    const res = await fetch(
      `${API_CONSTANTS.BASE_URL}/api/core/v1/auth/social/${provider}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, `${provider} login failed`));
    }

    const { data }: ApiAuthPayload = await res.json();
    return {
      user: mapApiUser(data.user),
      token: data.accessToken,
    };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.USERS.PROFILE), {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      if (!res.ok) return null;

      const body: { data: ApiUserPayload } = await res.json();
      return mapApiUser(body.data);
    } catch {
      return null;
    }
  }

  async logout(_token: string): Promise<void> {
    /* Core has no logout route; cookies cleared client-side. */
  }
}
