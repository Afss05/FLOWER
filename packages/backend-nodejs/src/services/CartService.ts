import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import { NotFoundError, AppError } from "../utils/errors.js";

export class CartService {
  async getCart(userId: number, tenantId: string): Promise<any> {
    let cart = await Cart.findOne({
      where: { userId, tenantId },
    });

    if (!cart) {
      cart = await Cart.create({ userId, tenantId });
    }

    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product, as: "product" }],
    });

    return {
      id: cart.id,
      items,
      total: items.reduce(
        (sum: number, item: any) => sum + parseFloat(item.priceAtTime) * item.quantity,
        0
      ),
      itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
    };
  }

  async addItem(
    userId: number,
    tenantId: string,
    productId: number,
    quantity: number
  ): Promise<CartItem> {
    // Get or create cart
    let cart = await Cart.findOne({
      where: { userId, tenantId },
    });

    if (!cart) {
      cart = await Cart.create({ userId, tenantId });
    }

    // Check product exists and get price
    const product = await Product.findOne({
      where: { id: productId, tenantId },
    });

    if (!product) {
      throw new NotFoundError("Product");
    }

    if (product.stockQuantity < quantity) {
      throw new AppError("Insufficient stock available", 400);
    }

    // Check if item already in cart
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    const priceAtTime = product.discountedPrice || product.price;

    if (cartItem) {
      // Update existing item
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new item
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        priceAtTime: parseFloat(priceAtTime.toString()),
      });
    }

    return cartItem;
  }

  async updateItem(
    userId: number,
    tenantId: string,
    itemId: number,
    quantity: number
  ): Promise<CartItem> {
    const cartItem = await CartItem.findOne({
      include: [
        {
          model: Cart,
          as: "cart",
          where: { userId, tenantId },
        },
      ],
      where: { id: itemId },
    });

    if (!cartItem) {
      throw new NotFoundError("Cart item");
    }

    if (quantity <= 0) {
      await cartItem.destroy();
      throw new AppError("Item removed from cart", 200);
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return cartItem;
  }

  async removeItem(
    userId: number,
    tenantId: string,
    itemId: number
  ): Promise<void> {
    const cartItem = await CartItem.findOne({
      include: [
        {
          model: Cart,
          as: "cart",
          where: { userId, tenantId },
        },
      ],
      where: { id: itemId },
    });

    if (!cartItem) {
      throw new NotFoundError("Cart item");
    }

    await cartItem.destroy();
  }

  async clearCart(userId: number, tenantId: string): Promise<void> {
    const cart = await Cart.findOne({
      where: { userId, tenantId },
    });

    if (cart) {
      await CartItem.destroy({
        where: { cartId: cart.id },
      });
    }
  }
}

export default new CartService();
