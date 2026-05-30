import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/User.js";
import { RegisterInput, LoginInput } from "../validators/index.js";
import { UnauthorizedError, ConflictError } from "../utils/errors.js";

export class AuthService {
  generateToken(user: User): string {
    const options: SignOptions = {
      expiresIn: "7d" as const,
    };
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
      process.env.JWT_SECRET || "secret",
      options
    );
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }

  async register(
    data: RegisterInput,
    tenantId: string
  ): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: data.email, tenantId },
    });

    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    // Create new user
    const user = await User.create({
      ...data,
      tenantId,
    });

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  async login(
    data: LoginInput,
    tenantId: string
  ): Promise<{ user: User; token: string }> {
    // Find user
    const user = await User.findOne({
      where: { email: data.email, tenantId },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await user.verifyPassword(data.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Check if user is active
    if (user.status !== "active") {
      throw new UnauthorizedError("Account is not active");
    }

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  async refreshToken(userId: number): Promise<string> {
    const user = await User.findByPk(userId);

    if (!user || user.status !== "active") {
      throw new UnauthorizedError("User not found or inactive");
    }

    return this.generateToken(user);
  }
}

export default new AuthService();
