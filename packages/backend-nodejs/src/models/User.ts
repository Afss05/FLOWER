import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcryptjs";

class User extends Model {
  declare id: number;
  declare tenantId: string;
  declare email: string;
  declare phone: string;
  declare name: string;
  declare password: string;
  declare emailVerifiedAt?: Date;
  declare phoneVerifiedAt?: Date;
  declare role: "customer" | "admin" | "super_admin";
  declare status: "active" | "inactive" | "suspended";

  async verifyPassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  getPublicData() {
    const { password, ...publicData } = this.dataValues;
    return publicData;
  }
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "email_tenant",
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phoneVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("customer", "admin", "super_admin"),
      defaultValue: "customer",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    hooks: {
      beforeCreate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

export default User;
