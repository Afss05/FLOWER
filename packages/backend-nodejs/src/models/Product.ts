import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Product extends Model {
  declare id: number;
  declare tenantId: string;
  declare categoryId: number;
  declare name: string;
  declare descriptionEn: string;
  declare descriptionTa: string;
  declare templeUsage: string;
  declare sku: string;
  declare price: number;
  declare discountedPrice?: number;
  declare stockQuantity: number;
  declare minOrderQuantity: number;
  declare isFresh: boolean;
  declare freshnessdays?: number;
  declare isSeasonal: boolean;
  declare isFestivalSpecial: boolean;
  declare festivalId?: number;
  declare rating: number;
  declare reviewCount: number;
}

Product.init(
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
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descriptionEn: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descriptionTa: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    templeUsage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "sku_tenant",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    discountedPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    minOrderQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    isFresh: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    freshnessdays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isSeasonal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isFestivalSpecial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    festivalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["tenantId", "categoryId"], unique: false },
      { fields: ["tenantId", "isFestivalSpecial"], unique: false },
      { fields: ["tenantId", "isSeasonal"], unique: false },
    ],
  }
);

export default Product;
