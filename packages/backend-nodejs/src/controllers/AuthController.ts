import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate.js";
import authService from "../services/AuthService.js";
import { registerSchema, loginSchema } from "../validators/index.js";
import { sendSuccess, sendError } from "../utils/helpers.js";
import User from "../models/User.js";

export class AuthController {
  async register(req: AuthRequest, res: Response) {
    try {
      const validated = registerSchema.parse(req.body);
      const tenantId = process.env.CLIENT_ID || "default";

      const { user, token } = await authService.register(validated, tenantId);

      sendSuccess(
        res,
        {
          user: user.getPublicData(),
          token,
        },
        "Registration successful",
        201
      );
    } catch (error: any) {
      if (error.errors) {
        return sendError(res, "Validation error", 400, error.errors);
      }
      throw error;
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const validated = loginSchema.parse(req.body);
      const tenantId = process.env.CLIENT_ID || "default";

      const { user, token } = await authService.login(validated, tenantId);

      sendSuccess(res, {
        user: user.getPublicData(),
        token,
      });
    } catch (error: any) {
      if (error.errors) {
        return sendError(res, "Validation error", 400, error.errors);
      }
      throw error;
    }
  }

  async refresh(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, "Not authenticated", 401);
    }

    const token = await authService.refreshToken(req.user.id);
    sendSuccess(res, { token });
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, "Not authenticated", 401);
    }

    const user = await User.findByPk(req.user.id);
    sendSuccess(res, user?.getPublicData());
  }
}

export default new AuthController();
