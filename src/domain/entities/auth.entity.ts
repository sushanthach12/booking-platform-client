export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isHost: boolean;
  role?: "host" | "guest";
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

/** Which auth flow an OTP belongs to — must match the backend's EOtpContext. */
export type OtpContext = "login" | "signup";

/**
 * Response of login/signup: no session yet — the user must verify the emailed
 * 6-digit code via `verifyOtp` to receive tokens.
 */
export interface OtpChallengeResponse {
  message: string;
  otpRequired: boolean;
  email: string;
}
