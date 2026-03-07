import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/types";
import type {
  AuthResponse,
  IAuthRepository,
  LoginCredentials,
  SignupCredentials,
  User,
} from "../interfaces/auth.interface";

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

  async resetPassword(email: string): Promise<void> {
    return this.authRepository.resetPassword(email);
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

  async logout(token: string): Promise<void> {
    return this.authRepository.logout(token);
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("authToken");
    if (!token) return null;

    // For simplicity, we'll validate synchronously
    // In real app, this would be an async call
    return this.authRepository.validateToken(token);
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  saveAuthData(authResponse: AuthResponse): void {
    if (typeof window === "undefined") return;

    localStorage.setItem("authToken", authResponse.token);
    localStorage.setItem("currentUser", JSON.stringify(authResponse.user));
  }

  clearAuthData(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  }
}
