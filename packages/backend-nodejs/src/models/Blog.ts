import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Blog extends Model {
  declare id: number;
  declare tenantId: string;
  declare titleEn: string;
  declare titleTa: string;
  declare slug: string;
  declare contentEn: string;
  declare contentTa: string;
  declare excerptEn: string;
  declare excerptTa: string;
  declare featuredImage: string;
  declare authorId: number;
  declare status: "draft" | "published";
  declare publishedAt?: Date;
  declare seoTitle: string;
  declare seoDescription: string;
  declare seoKeywords: string;
}

Blog.init(
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
    titleEn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    titleTa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "slug_tenant",
    },
    contentEn: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    contentTa: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    excerptEn: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    excerptTa: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    featuredImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      defaultValue: "draft",
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    seoTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seoDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seoKeywords: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "blogs",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [
      { fields: ["tenantId", "status"], unique: false },
      { fields: ["tenantId", "slug"], unique: false },
    ],
  }
);

export default Blog;
