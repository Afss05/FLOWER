import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class CartItem extends Model {
  declare id: number;
  declare cartId: number;
  declare productId: number;
  declare quantity: number;
  declare priceAtTime: number;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "carts",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    priceAtTime: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "cart_items",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

export default CartItem;
