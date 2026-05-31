import dotenv from "dotenv";
dotenv.config();

import sequelize from "../config/database.js";
import { setupAssociations } from "../models/associations.js";

// Import all models so Sequelize registers them
import "../models/User.js";
import "../models/Category.js";
import "../models/Product.js";
import "../models/ProductImage.js";
import "../models/Cart.js";
import "../models/CartItem.js";
import "../models/Order.js";
import "../models/OrderItem.js";
import "../models/Payment.js";
import "../models/Address.js";
import "../models/Blog.js";
import "../models/Review.js";
import "../models/Subscription.js";
import "../models/SubscriptionDelivery.js";
import "../models/Coupon.js";

setupAssociations();

async function migrate(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("✓ Database connected");

    console.log("Running migrations (sync alter)...");
    await sequelize.sync({ alter: true });
    console.log("✓ All tables created / updated");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate();
