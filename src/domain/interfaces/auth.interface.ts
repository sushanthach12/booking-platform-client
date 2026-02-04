export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isHost: boolean;
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
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  signup(credentials: SignupCredentials): Promise<AuthResponse>;
  resetPassword(email: string): Promise<void>;
  socialLogin(provider: 'google' | 'facebook' | 'apple', email?: string): Promise<AuthResponse>;
  validateToken(token: string): Promise<User | null>;
  logout(token: string): Promise<void>;
}
