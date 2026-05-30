import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "flowershop_default_public",
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
});

export async function initializeDatabase(): Promise<boolean> {
  try {
    await sequelize.authenticate();
    console.log("✓ Database authentication successful");

    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("✓ Database models synchronized");
    return true;
  } catch (error) {
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (isDevelopment) {
      console.warn("⚠ Database connection failed in development mode");
      console.warn("⚠ Starting server without database connection");
      console.warn("⚠ Database features will not be available");
      console.warn("\n📌 To fix this, start MySQL and ensure:");
      console.warn("  - MySQL server is running");
      console.warn("  - Host: " + (process.env.DB_HOST || "localhost"));
      console.warn("  - Port: " + (process.env.DB_PORT || "3306"));
      console.warn("  - Username: " + (process.env.DB_USERNAME || "root"));
      console.warn("  - Database: " + (process.env.DB_DATABASE || "flowershop_default_public"));
      console.warn("\n💡 For Windows with XAMPP/MySQL:");
      console.warn("  1. Start MySQL service from Services");
      console.warn("  2. Or run: mysql.server start (on Mac)");
      console.warn("  3. Or use Docker: docker run -d -p 3306:3306 mysql:8.0\n");
      
      return false; // Return false, continue server startup without database
    } else {
      console.error("Database initialization failed:", error);
      throw error;
    }
  }
}

export default sequelize;
