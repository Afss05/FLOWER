import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Order extends Model {
  declare id: number;
  declare tenantId: string;
  declare userId: number;
  declare orderNumber: string;
  declare totalAmount: number;
  declare discountAmount: number;
  declare couponId?: number;
  declare deliveryFee: number;
  declare finalAmount: number;
  declare status:
    | "pending"
    | "confirmed"
    | "packing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  declare deliveryAddressId: number;
  declare deliveryDate: Date;
  declare deliverySlotId?: number;
  declare specialInstructions?: string;
  declare isSameDay: boolean;
  declare deliveredAt?: Date;
}

Order.init(
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
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "order_number_tenant",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    couponId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deliveryFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    finalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "packing",
        "out_for_delivery",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
    },
    deliveryAddressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "addresses",
        key: "id",
      },
    },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deliverySlotId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isSameDay: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["tenantId", "userId"], unique: false },
      { fields: ["tenantId", "status"], unique: false },
      { fields: ["tenantId", "deliveryDate"], unique: false },
    ],
  }
);

export default Order;
