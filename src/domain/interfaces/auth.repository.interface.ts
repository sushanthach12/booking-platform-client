import type {
  AuthResponse,
  LoginCredentials,
  OtpChallengeResponse,
  OtpContext,
  SignupCredentials,
  User,
} from "@/domain/entities";

export interface IAuthRepository {
  /** Starts login: validates credentials and triggers an OTP email. */
  login(credentials: LoginCredentials): Promise<OtpChallengeResponse>;
  /** Starts signup: the account is only created after OTP verification. */
  signup(credentials: SignupCredentials): Promise<OtpChallengeResponse>;
  /** Completes login/signup: exchanges the 6-digit code for the session. */
  verifyOtp(
    email: string,
    otp: string,
    context: OtpContext,
  ): Promise<AuthResponse>;
  /** Re-sends the OTP for a pending login/signup verification. */
  resendOtp(email: string, context: OtpContext): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  socialLogin(
    provider: "google" | "facebook" | "apple",
    idToken: string,
  ): Promise<AuthResponse>;
  validateToken(token: string): Promise<User | null>;
  logout(token: string): Promise<void>;
  refreshToken(): Promise<AuthResponse>;
  /** Elevate the current user to host and return a fresh host-scoped session. */
  becomeHost(): Promise<AuthResponse>;
}
