// Auth service that acts as a singleton for managing auth state
import { getAuthUseCase } from '@/domain/di';
import type { User, LoginCredentials, SignupCredentials, AuthResponse } from '@/domain/interfaces/auth.interface';

// Export types for external use
export type { User, LoginCredentials, SignupCredentials, AuthResponse };

class AuthService {
  private static instance: AuthService;
  private authUseCase = getAuthUseCase();
  private currentUser: User | null = null;
  private token: string | null = null;

  private constructor() {
    // Load from localStorage on init
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      const savedToken = localStorage.getItem('authToken');
      
      if (savedUser && savedToken) {
        this.currentUser = JSON.parse(savedUser);
        this.token = savedToken;
      }
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const authResponse = await this.authUseCase.login(credentials);
    
    this.currentUser = authResponse.user;
    this.token = authResponse.token;
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
      localStorage.setItem('authToken', authResponse.token);
    }
    
    return authResponse;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const authResponse = await this.authUseCase.signup(credentials);
    
    this.currentUser = authResponse.user;
    this.token = authResponse.token;
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
      localStorage.setItem('authToken', authResponse.token);
    }
    
    return authResponse;
  }

  async resetPassword(email: string): Promise<void> {
    await this.authUseCase.resetPassword(email);
  }

  async socialLogin(provider: 'google' | 'facebook' | 'apple', email?: string): Promise<AuthResponse> {
    const authResponse = await this.authUseCase.socialLogin(provider, email);
    
    this.currentUser = authResponse.user;
    this.token = authResponse.token;
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
      localStorage.setItem('authToken', authResponse.token);
    }
    
    return authResponse;
  }

  logout(): void {
    if (this.token) {
      this.authUseCase.logout(this.token);
    }
    
    this.currentUser = null;
    this.token = null;
    
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.token;
  }

  // Initialize auth state from localStorage
  async initializeAuth(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      try {
        const user = await this.authUseCase.validateToken(savedToken);
        if (user) {
          this.currentUser = user;
          this.token = savedToken;
        } else {
          // Token invalid, clear stored data
          this.clearStoredAuth();
        }
      } catch (error) {
        console.error('Failed to validate token:', error);
        this.clearStoredAuth();
      }
    }
  }

  private clearStoredAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }
}

export const authService = AuthService.getInstance();
