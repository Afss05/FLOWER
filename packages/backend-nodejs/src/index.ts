import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import "express-async-errors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initializeDatabase } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import userRoutes from "./routes/users.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import blogRoutes from "./routes/blogs.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 8000;

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "localhost:5173").split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Compression
app.use(compression());

// Logging
app.use(morgan("combined"));
app.use(requestLogger);

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "../storage/uploads")));

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Error Handler
app.use(errorHandler);

// Initialize and Start Server
async function startServer() {
  try {
    // Initialize Database
    const dbConnected = await initializeDatabase();
    if (dbConnected) {
      console.log("✓ Database connected and synchronized");
    }

    // Start Server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
      console.log(`✓ API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
