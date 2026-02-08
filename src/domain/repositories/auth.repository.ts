import "reflect-metadata";
import { injectable } from "tsyringe";
import type { IAuthRepository } from "../interfaces/auth.interface";
import type {
  User,
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
} from "../interfaces/auth.interface";

@injectable()
export class AuthRepository implements IAuthRepository {
  private users: Map<string, User> = new Map();
  private tokens: Map<string, { userId: string; expiresAt: number }> =
    new Map();

  constructor() {
    // Initialize with a demo user
    this.users.set("demo@example.com", {
      id: "1",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      avatar: "/avatar1.jpg",
      isHost: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = this.users.get(credentials.email);

    if (!user) {
      throw new Error("User not found");
    }

    // In real app, you'd hash and compare passwords
    // For demo, we'll accept any password for existing users
    const token = this.generateToken(user.id);

    return {
      user,
      token,
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user already exists
    if (this.users.has(credentials.email)) {
      throw new Error("User already exists");
    }

    const user: User = {
      id: this.generateUserId(),
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      isHost: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(credentials.email, user);
    const token = this.generateToken(user.id);

    return {
      user,
      token,
    };
  }

  async resetPassword(email: string): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = this.users.get(email);
    if (!user) {
      throw new Error("User not found");
    }

    // In real app, this would send an email
    console.log(`Password reset link sent to ${email}`);
  }

  async socialLogin(
    provider: "google" | "facebook" | "apple",
    email?: string,
  ): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userEmail = email || `${provider.toLowerCase()}-user@example.com`;

    let user = this.users.get(userEmail);

    if (!user) {
      // Create new user from social login
      user = {
        id: this.generateUserId(),
        email: userEmail,
        firstName: "Social",
        lastName: "User",
        avatar: `/avatar-${provider}.jpg`,
        isHost: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.users.set(userEmail, user);
    }

    const token = this.generateToken(user.id);

    return {
      user,
      token,
    };
  }

  async validateToken(token: string): Promise<User | null> {
    const tokenData = this.tokens.get(token);

    if (!tokenData || Date.now() > tokenData.expiresAt) {
      return null;
    }

    // Find user by ID
    for (const user of this.users.values()) {
      if (user.id === tokenData.userId) {
        return user;
      }
    }

    return null;
  }

  async logout(token: string): Promise<void> {
    this.tokens.delete(token);
  }

  private generateToken(userId: string): string {
    const token = `mock-jwt-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store token with expiration (24 hours)
    this.tokens.set(token, {
      userId,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    return token;
  }

  private generateUserId(): string {
    return (
      Date.now().toString() + "-" + Math.random().toString(36).substr(2, 9)
    );
  }
}
