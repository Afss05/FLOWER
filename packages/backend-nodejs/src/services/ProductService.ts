import { Op } from "sequelize";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import ProductImage from "../models/ProductImage.js";
import { NotFoundError } from "../utils/errors.js";
import { PaginatedResponse, PaginationParams } from "../types/index.js";

export class ProductService {
  async getAll(
    tenantId: string,
    filters: any,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    const where: any = { tenantId };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.search) {
      where.name = {
        [Op.like]: `%${filters.search}%`,
      };
    }

    if (filters.isFestivalSpecial) {
      where.isFestivalSpecial = true;
    }

    if (filters.isSeasonal) {
      where.isSeasonal = true;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price[Op.gte] = filters.minPrice;
      if (filters.maxPrice) where.price[Op.lte] = filters.maxPrice;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: ProductImage, as: "images" }],
      limit: pagination.limit,
      offset: pagination.offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows,
      total: count,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(count / pagination.limit),
    };
  }

  async getById(tenantId: string, id: number): Promise<Product> {
    const product = await Product.findOne({
      where: { id, tenantId },
      include: [
        { model: ProductImage, as: "images" },
        { model: Category, as: "category" },
      ],
    });

    if (!product) {
      throw new NotFoundError("Product");
    }

    return product;
  }

  async getFestivalSpecials(tenantId: string): Promise<Product[]> {
    return Product.findAll({
      where: { tenantId, isFestivalSpecial: true, stockQuantity: { [Op.gt]: 0 } },
      include: [{ model: ProductImage, as: "images" }],
      limit: 12,
      order: [["createdAt", "DESC"]],
    });
  }

  async getTrending(tenantId: string): Promise<Product[]> {
    return Product.findAll({
      where: {
        tenantId,
        stockQuantity: { [Op.gt]: 0 },
        rating: { [Op.gte]: 3.5 },
      },
      include: [{ model: ProductImage, as: "images" }],
      limit: 12,
      order: [["rating", "DESC"]],
    });
  }

  async search(
    tenantId: string,
    query: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    const { count, rows } = await Product.findAndCountAll({
      where: {
        tenantId,
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { descriptionEn: { [Op.like]: `%${query}%` } },
          { templeUsage: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [{ model: ProductImage, as: "images" }],
      limit: pagination.limit,
      offset: pagination.offset,
    });

    return {
      data: rows,
      total: count,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(count / pagination.limit),
    };
  }

  async getRelated(tenantId: string, productId: number): Promise<Product[]> {
    const product = await this.getById(tenantId, productId);

    return Product.findAll({
      where: {
        tenantId,
        categoryId: product.categoryId,
        id: { [Op.ne]: productId },
        stockQuantity: { [Op.gt]: 0 },
      },
      include: [{ model: ProductImage, as: "images" }],
      limit: 6,
    });
  }

  async create(tenantId: string, data: any): Promise<Product> {
    const product = await Product.create({
      ...data,
      tenantId,
    });

    return product;
  }

  async update(tenantId: string, id: number, data: any): Promise<Product> {
    const product = await this.getById(tenantId, id);
    await product.update(data);
    return product;
  }

  async delete(tenantId: string, id: number): Promise<void> {
    const product = await this.getById(tenantId, id);
    await product.destroy();
  }
}

export default new ProductService();
