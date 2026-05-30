import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate.js";
import productService from "../services/ProductService.js";
import { sendSuccess, sendPaginated, getPaginationParams } from "../utils/helpers.js";

export class ProductController {
  async getAll(req: AuthRequest, res: Response) {
    const tenantId = process.env.CLIENT_ID || "default";
    const pagination = getPaginationParams(
      typeof req.query.page === "string" ? req.query.page : undefined,
      typeof req.query.limit === "string" ? req.query.limit : undefined
    );
    const filters = {
      categoryId: req.query.categoryId ? parseInt(String(req.query.categoryId)) : null,
      search: req.query.search ? String(req.query.search) : null,
      isFestivalSpecial: req.query.festival === "true",
      isSeasonal: req.query.seasonal === "true",
      minPrice: req.query.minPrice ? parseFloat(String(req.query.minPrice)) : null,
      maxPrice: req.query.maxPrice ? parseFloat(String(req.query.maxPrice)) : null,
    };

    const result = await productService.getAll(tenantId, filters, pagination);
    sendPaginated(
      res,
      result.data,
      result.total,
      result.page,
      result.limit,
      "Products retrieved successfully"
    );
  }

  async getById(req: AuthRequest, res: Response) {
    const tenantId = process.env.CLIENT_ID || "default";
    const product = await productService.getById(tenantId, parseInt(req.params.id));
    sendSuccess(res, product);
  }

  async getFestivalSpecials(req: AuthRequest, res: Response) {
    const tenantId = process.env.CLIENT_ID || "default";
    const products = await productService.getFestivalSpecials(tenantId);
    sendSuccess(res, products, "Festival specials retrieved successfully");
  }

  async getTrending(req: AuthRequest, res: Response) {
    const tenantId = process.env.CLIENT_ID || "default";
    const products = await productService.getTrending(tenantId);
    sendSuccess(res, products, "Trending products retrieved successfully");
  }

  async search(req: AuthRequest, res: Response) {
    const tenantId = process.env.CLIENT_ID || "default";
    const { q } = req.query;

    if (!q) {
      return sendSuccess(res, [], "No search query provided");
    }

    const pagination = getPaginationParams(
      typeof req.query.page === "string" ? req.query.page : undefined,
      typeof req.query.limit === "string" ? req.query.limit : undefined
    );
    const result = await productService.search(tenantId, String(q), pagination);

    sendPaginated(
      res,
      result.data,
      result.total,
      result.page,
      result.limit,
      "Search results retrieved"
    );
  }

  async getRelated(req: AuthRequest, res: Response) {
    const tenantId = process.env.CLIENT_ID || "default";
    const products = await productService.getRelated(tenantId, parseInt(req.params.id));
    sendSuccess(res, products, "Related products retrieved successfully");
  }

  async create(req: AuthRequest, res: Response) {
    const tenantId = process.env.CLIENT_ID || "default";
    const product = await productService.create(tenantId, req.body);
    sendSuccess(res, product, "Product created successfully", 201);
  }

  async update(req: AuthRequest, res: Response) {
    const tenantId = process.env.CLIENT_ID || "default";
    const product = await productService.update(tenantId, parseInt(req.params.id), req.body);
    sendSuccess(res, product, "Product updated successfully");
  }

  async delete(req: AuthRequest, res: Response) {
    const tenantId = process.env.CLIENT_ID || "default";
    await productService.delete(tenantId, parseInt(req.params.id));
    sendSuccess(res, null, "Product deleted successfully");
  }
}

export default new ProductController();
