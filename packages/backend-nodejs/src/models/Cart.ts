import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Cart extends Model {
  declare id: number;
  declare userId: number;
  declare tenantId: string;
  declare expiresAt: Date;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    tenantId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      defaultValue: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  {
    sequelize,
    tableName: "carts",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [{ fields: ["tenantId"], unique: false }],
  }
);

export default Cart;
