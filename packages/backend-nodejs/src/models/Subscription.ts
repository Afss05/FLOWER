import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Subscription extends Model {
  declare id: number;
  declare tenantId: string;
  declare userId: number;
  declare name: string;
  declare description: string;
  declare frequency: "daily" | "weekly" | "monthly";
  declare price: number;
  declare productIds: number[];
  declare deliveryAddressId: number;
  declare deliverySlotId?: number;
  declare startDate: Date;
  declare endDate?: Date;
  declare nextDeliveryDate: Date;
  declare status: "active" | "paused" | "cancelled";
  declare cancellationReason?: string;
}

Subscription.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    frequency: {
      type: DataTypes.ENUM("daily", "weekly", "monthly"),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    productIds: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    deliveryAddressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "addresses",
        key: "id",
      },
    },
    deliverySlotId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "paused", "cancelled"),
      defaultValue: "active",
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "subscriptions",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["tenantId", "userId"], unique: false },
      { fields: ["tenantId", "status"], unique: false },
    ],
  }
);

export default Subscription;
