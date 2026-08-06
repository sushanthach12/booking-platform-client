import type {
  AuthResponse,
  LoginCredentials,
  OtpChallengeResponse,
  OtpContext,
  SignupCredentials,
  User,
} from "@/domain/entities";
import type { IAuthRepository } from "@/domain/interfaces";
import {
  COOKIE_KEYS,
  deleteCookie,
  getCookie,
  setCookie,
} from "@/lib/utils/cookies";
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/types";

@injectable()
export class AuthUseCase {
  constructor(
    @inject(TOKENS.IAuthRepository)
    private readonly authRepository: IAuthRepository,
  ) {}

  /** Step 1 of login — triggers an OTP email; no session is created yet. */
  async login(credentials: LoginCredentials): Promise<OtpChallengeResponse> {
    return this.authRepository.login(credentials);
  }

  /** Step 1 of signup — triggers an OTP email; the account is created on verify. */
  async signup(credentials: SignupCredentials): Promise<OtpChallengeResponse> {
    return this.authRepository.signup(credentials);
  }

  /**
   * Step 2 of login/signup — exchanges the 6-digit code for the session.
   * This is the only email/password path that returns tokens.
   */
  async verifyOtp(
    email: string,
    otp: string,
    context: OtpContext,
  ): Promise<AuthResponse> {
    return this.authRepository.verifyOtp(email, otp, context);
  }

  /** Re-send the OTP for a pending login/signup verification. */
  async resendOtp(email: string, context: OtpContext): Promise<void> {
    return this.authRepository.resendOtp(email, context);
  }

  async forgotPassword(email: string): Promise<void> {
    return this.authRepository.forgotPassword(email);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.authRepository.resetPassword(token, newPassword);
  }

  async socialLogin(provider: "google", idToken: string): Promise<AuthResponse> {
    return this.authRepository.socialLogin(provider, idToken);
  }

  async validateToken(token: string): Promise<User | null> {
    return this.authRepository.validateToken(token);
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      await this.authRepository.logout(token).catch(() => {});
    }
    this.clearAuthData();
  }

  async becomeHost(): Promise<AuthResponse> {
    const response = await this.authRepository.becomeHost();
    this.saveAuthData(response);
    return response;
  }

  async refreshToken(): Promise<string | null> {
    try {
      const response = await this.authRepository.refreshToken();
      this.saveAuthData(response);
      return response.token;
    } catch {
      this.clearAuthData();
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null;
    const userStr = getCookie(COOKIE_KEYS.AUTH_USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return getCookie(COOKIE_KEYS.AUTH_TOKEN);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  saveAuthData(authResponse: AuthResponse): void {
    if (typeof window === "undefined") return;
    setCookie(COOKIE_KEYS.AUTH_TOKEN, authResponse.token);
    setCookie(COOKIE_KEYS.AUTH_USER, JSON.stringify(authResponse.user));
    if (authResponse.refreshToken) {
      setCookie(COOKIE_KEYS.REFRESH_TOKEN, authResponse.refreshToken);
    }
  }

  clearAuthData(): void {
    if (typeof window === "undefined") return;
    deleteCookie(COOKIE_KEYS.AUTH_TOKEN);
    deleteCookie(COOKIE_KEYS.AUTH_USER);
    deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);
  }
}
