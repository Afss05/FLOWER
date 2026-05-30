import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errors.js";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    tenantId?: string;
  };
  token?: string;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid authorization header", 401);
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      tenantId: decoded.tenantId,
    };

    req.token = token;

    next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid or expired token", 401);
    }
    throw error;
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Insufficient permissions", 403);
    }

    next();
  };
}
