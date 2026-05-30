import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Payment extends Model {
  declare id: number;
  declare tenantId: string;
  declare orderId: number;
  declare userId: number;
  declare amount: number;
  declare method: "upi" | "card" | "wallet" | "cod";
  declare paymentGateway: "razorpay";
  declare gatewayOrderId: string;
  declare gatewayPaymentId?: string;
  declare status: "pending" | "success" | "failed" | "refunded";
  declare refundAmount?: number;
  declare refundReason?: string;
  declare errorMessage?: string;
  declare paidAt?: Date;
}

Payment.init(
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
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM("upi", "card", "wallet", "cod"),
      allowNull: false,
    },
    paymentGateway: {
      type: DataTypes.STRING,
      defaultValue: "razorpay",
    },
    gatewayOrderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "gateway_order_id_tenant",
    },
    gatewayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
      defaultValue: "pending",
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "payments",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["tenantId", "status"], unique: false },
      { fields: ["tenantId", "userId"], unique: false },
      { fields: ["tenantId", "orderId"], unique: false },
    ],
  }
);

export default Payment;
