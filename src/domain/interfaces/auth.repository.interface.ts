import type {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  User,
} from "@/domain/entities";

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  signup(credentials: SignupCredentials): Promise<AuthResponse>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  socialLogin(
    provider: "google" | "facebook" | "apple",
    email?: string,
  ): Promise<AuthResponse>;
  validateToken(token: string): Promise<User | null>;
  logout(token: string): Promise<void>;
}
