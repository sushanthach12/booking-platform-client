import type {
  AuthResponse,
  LoginCredentials,
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

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.authRepository.login(credentials);
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    return this.authRepository.signup(credentials);
  }

  async forgotPassword(email: string): Promise<void> {
    return this.authRepository.forgotPassword(email);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.authRepository.resetPassword(token, newPassword);
  }

  async socialLogin(
    provider: "google" | "facebook" | "apple",
    email?: string,
  ): Promise<AuthResponse> {
    return this.authRepository.socialLogin(provider, email);
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
  }

  clearAuthData(): void {
    if (typeof window === "undefined") return;
    deleteCookie(COOKIE_KEYS.AUTH_TOKEN);
    deleteCookie(COOKIE_KEYS.AUTH_USER);
  }
}
