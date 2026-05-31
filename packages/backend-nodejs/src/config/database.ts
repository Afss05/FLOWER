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
    console.log("✓ Database connected and synchronized");
    return true;
  } catch (error) {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      console.warn("⚠ Database connection failed — run 'pnpm db:migrate' to set up tables");
      return false;
    } else {
      console.error("Database initialization failed:", error);
      throw error;
    }
  }
}

export default sequelize;
