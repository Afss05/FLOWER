import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Review extends Model {
  declare id: number;
  declare tenantId: string;
  declare productId: number;
  declare userId: number;
  declare orderId: number;
  declare rating: number;
  declare title: string;
  declare comment: string;
  declare isVerifiedPurchase: boolean;
  declare helpfulCount: number;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenantId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isVerifiedPurchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    helpfulCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "reviews",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["tenantId", "productId"], unique: false },
      { fields: ["tenantId", "userId"], unique: false },
    ],
  }
);

export default Review;
