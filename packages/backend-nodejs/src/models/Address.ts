import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Address extends Model {
  declare id: number;
  declare userId: number;
  declare tenantId: string;
  declare name: string;
  declare phone: string;
  declare addressLine1: string;
  declare addressLine2?: string;
  declare city: string;
  declare state: string;
  declare postalCode: string;
  declare locationType: "home" | "office" | "temple";
  declare isDefault: boolean;
  declare latitude?: number;
  declare longitude?: number;
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tenantId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    addressLine2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locationType: {
      type: DataTypes.ENUM("home", "office", "temple"),
      defaultValue: "home",
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "addresses",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    indexes: [{ fields: ["tenantId", "userId"] }],
  }
);

export default Address;
