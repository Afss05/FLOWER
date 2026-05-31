import User from "./User.js";
import Product from "./Product.js";
import Category from "./Category.js";
import ProductImage from "./ProductImage.js";
import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import Payment from "./Payment.js";
import Address from "./Address.js";
import Blog from "./Blog.js";
import Review from "./Review.js";
import Subscription from "./Subscription.js";
import SubscriptionDelivery from "./SubscriptionDelivery.js";

export function setupAssociations(): void {
  // Category <-> Product
  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  // Product <-> ProductImage
  Product.hasMany(ProductImage, { foreignKey: "productId", as: "images", onDelete: "CASCADE" });
  ProductImage.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // User <-> Cart
  User.hasOne(Cart, { foreignKey: "userId", as: "cart", onDelete: "CASCADE" });
  Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Cart <-> CartItem
  Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items", onDelete: "CASCADE" });
  CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

  // Product <-> CartItem
  Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });
  CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // User <-> Order
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  Order.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Order <-> OrderItem
  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items", onDelete: "CASCADE" });
  OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  // Product <-> OrderItem
  Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
  OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // Order <-> Payment
  Order.hasOne(Payment, { foreignKey: "orderId", as: "payment" });
  Payment.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  // User <-> Address
  User.hasMany(Address, { foreignKey: "userId", as: "addresses", onDelete: "CASCADE" });
  Address.belongsTo(User, { foreignKey: "userId", as: "user" });

  // User <-> Review
  User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
  Review.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Product <-> Review
  Product.hasMany(Review, { foreignKey: "productId", as: "reviews", onDelete: "CASCADE" });
  Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // User <-> Subscription
  User.hasMany(Subscription, { foreignKey: "userId", as: "subscriptions" });
  Subscription.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Product <-> Subscription
  Product.hasMany(Subscription, { foreignKey: "productId", as: "subscriptions" });
  Subscription.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // Subscription <-> SubscriptionDelivery
  Subscription.hasMany(SubscriptionDelivery, { foreignKey: "subscriptionId", as: "deliveries", onDelete: "CASCADE" });
  SubscriptionDelivery.belongsTo(Subscription, { foreignKey: "subscriptionId", as: "subscription" });

  // User <-> Blog
  User.hasMany(Blog, { foreignKey: "authorId", as: "blogs" });
  Blog.belongsTo(User, { foreignKey: "authorId", as: "author" });
}
