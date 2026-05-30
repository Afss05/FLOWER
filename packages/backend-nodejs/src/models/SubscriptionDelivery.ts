import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class SubscriptionDelivery extends Model {
  declare id: number;
  declare subscriptionId: number;
  declare deliveryDate: Date;
  declare status: "scheduled" | "delivered" | "cancelled";
  declare orderId?: number;
}

SubscriptionDelivery.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subscriptionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "subscriptions",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "delivered", "cancelled"),
      defaultValue: "scheduled",
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "orders",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "subscription_deliveries",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["subscriptionId", "status"], unique: false },
      { fields: ["deliveryDate"], unique: false },
    ],
  }
);

export default SubscriptionDelivery;
