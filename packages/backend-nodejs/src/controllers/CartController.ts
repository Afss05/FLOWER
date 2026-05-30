import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate.js";
import cartService from "../services/CartService.js";
import { sendSuccess, sendError } from "../utils/helpers.js";
import { addToCartSchema } from "../validators/index.js";

export class CartController {
  async getCart(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, "Not authenticated", 401);
    }

    const tenantId = process.env.CLIENT_ID || "default";
    const cart = await cartService.getCart(req.user.id, tenantId);
    sendSuccess(res, cart);
  }

  async addItem(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, "Not authenticated", 401);
    }

    try {
      const validated = addToCartSchema.parse(req.body);
      const tenantId = process.env.CLIENT_ID || "default";

      const item = await cartService.addItem(
        req.user.id,
        tenantId,
        validated.productId,
        validated.quantity
      );

      const cart = await cartService.getCart(req.user.id, tenantId);
      sendSuccess(res, cart, "Item added to cart", 201);
    } catch (error: any) {
      if (error.errors) {
        return sendError(res, "Validation error", 400, error.errors);
      }
      throw error;
    }
  }

  async updateItem(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, "Not authenticated", 401);
    }

    const tenantId = process.env.CLIENT_ID || "default";
    const { quantity } = req.body;

    await cartService.updateItem(req.user.id, tenantId, parseInt(req.params.id), quantity);
    const cart = await cartService.getCart(req.user.id, tenantId);
    sendSuccess(res, cart, "Cart item updated");
  }

  async removeItem(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, "Not authenticated", 401);
    }

    const tenantId = process.env.CLIENT_ID || "default";
    await cartService.removeItem(req.user.id, tenantId, parseInt(req.params.id));
    const cart = await cartService.getCart(req.user.id, tenantId);
    sendSuccess(res, cart, "Item removed from cart");
  }

  async clearCart(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, "Not authenticated", 401);
    }

    const tenantId = process.env.CLIENT_ID || "default";
    await cartService.clearCart(req.user.id, tenantId);
    sendSuccess(res, { items: [] }, "Cart cleared");
  }
}

export default new CartController();
