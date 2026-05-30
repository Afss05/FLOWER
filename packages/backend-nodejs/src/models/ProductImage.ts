import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class ProductImage extends Model {
  declare id: number;
  declare productId: number;
  declare imageUrl: string;
  declare altText?: string;
  declare displayOrder: number;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    altText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "product_images",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

export default ProductImage;
