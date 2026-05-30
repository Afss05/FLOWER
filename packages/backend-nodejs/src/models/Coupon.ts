import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Coupon extends Model {
  declare id: number;
  declare tenantId: string;
  declare code: string;
  declare discountType: "fixed" | "percentage";
  declare discountValue: number;
  declare maxUses: number;
  declare usedCount: number;
  declare minAmount: number;
  declare applicableCategories?: number[];
  declare startDate: Date;
  declare endDate: Date;
}

Coupon.init(
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "code_tenant",
    },
    discountType: {
      type: DataTypes.ENUM("fixed", "percentage"),
      allowNull: false,
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    maxUses: {
      type: DataTypes.INTEGER,
      defaultValue: -1, // -1 means unlimited
    },
    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    minAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    applicableCategories: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "coupons",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["tenantId", "code"], unique: false },
      { fields: ["tenantId", "startDate", "endDate"], unique: false },
    ],
  }
);

export default Coupon;
