import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  User,
} from "@/domain/entities";
import { request, requestVoid } from "@/domain/http";
import type { IAuthRepository } from "@/domain/interfaces";
import { COOKIE_KEYS, getCookie } from "@/lib/utils/cookies";
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
    refreshToken?: string;
  };
}

function mapApiUser(u: ApiUserPayload): User {
  const name = u.name?.trim() ?? "";
  const parts = name.split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") || firstName || "";
  const role = (u.role ?? "guest").toLowerCase() as "host" | "guest";
  return {
    id: u.id,
    email: u.email,
    firstName,
    lastName,
    isHost: role === "host",
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

@injectable()
export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await request<ApiAuthPayload>(
      apiUrl(API_CONSTANTS.ENDPOINTS.AUTH.LOGIN),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
        auth: false,
        fallbackMessage: "Login failed",
      },
    );
    return {
      user: mapApiUser(data.user),
      token: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const name = `${credentials.firstName} ${credentials.lastName}`.trim();
    const { data } = await request<ApiAuthPayload>(
      apiUrl(API_CONSTANTS.ENDPOINTS.AUTH.REGISTER),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          name: name || credentials.email,
        }),
        auth: false,
        fallbackMessage: "Signup failed",
      },
    );
    return {
      user: mapApiUser(data.user),
      token: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    await requestVoid(apiUrl(API_CONSTANTS.ENDPOINTS.AUTH.FORGOT_PASSWORD), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      auth: false,
      fallbackMessage: "Password reset request failed",
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await requestVoid(apiUrl(API_CONSTANTS.ENDPOINTS.AUTH.RESET_PASSWORD), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
      auth: false,
      fallbackMessage: "Password reset failed",
    });
  }

  async socialLogin(
    provider: "google" | "facebook" | "apple",
    email?: string,
  ): Promise<AuthResponse> {
    const { data } = await request<ApiAuthPayload>(
      `${API_CONSTANTS.BASE_URL}/api/v1/auth/social/${provider}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        auth: false,
        fallbackMessage: `${provider} login failed`,
      },
    );
    return {
      user: mapApiUser(data.user),
      token: data.accessToken,
    };
  }

  async validateToken(token: string): Promise<User | null> {
    // Best-effort: an invalid/expired token resolves to null, never throws.
    try {
      const body = await request<{ data: ApiUserPayload } | null>(
        apiUrl(API_CONSTANTS.ENDPOINTS.USERS.PROFILE),
        {
          headers: { Authorization: `Bearer ${token}` },
          auth: false,
          nullOn: [401, 403, 404],
        },
      );
      return body ? mapApiUser(body.data) : null;
    } catch {
      return null;
    }
  }

  async logout(_token: string): Promise<void> {
    /* Core has no logout route; cookies cleared client-side. */
  }

  async refreshToken(): Promise<AuthResponse> {
    const storedRefreshToken = getCookie(COOKIE_KEYS.REFRESH_TOKEN);
    if (!storedRefreshToken) {
      throw new Error("No refresh token available");
    }

    const json = await request<{
      data: { accessToken: string; refreshToken: string };
    }>(apiUrl(API_CONSTANTS.ENDPOINTS.AUTH.REFRESH_TOKEN), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
      auth: false,
      fallbackMessage: "Session expired",
    });

    const currentUser = getCookie(COOKIE_KEYS.AUTH_USER);
    const user = currentUser
      ? (JSON.parse(currentUser) as ReturnType<typeof mapApiUser>)
      : mapApiUser({ id: "", email: "" });

    return {
      user,
      token: json.data.accessToken,
      refreshToken: json.data.refreshToken,
    };
  }
}
