import { Response } from "express";
import { ApiResponse, PaginatedResponse } from "../types/index.js";

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = 200
) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = "Success"
) {
  const totalPages = Math.ceil(total / limit);
  const response: ApiResponse<PaginatedResponse<T>> = {
    success: true,
    message,
    data: {
      data,
      total,
      page,
      limit,
      totalPages,
    },
  };
  return res.status(200).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: any
) {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
}

export function getPaginationParams(
  page: string | number = 1,
  limit: string | number = 15
) {
  const pageNum = Math.max(1, parseInt(String(page)) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 15));
  const offset = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, offset };
}

export function generateOrderNumber(tenantId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${tenantId.toUpperCase()}-${timestamp}-${random}`.toUpperCase();
}

export function generateSku(productName: string): string {
  const slug = productName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .substring(0, 10);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${slug}-${random}`;
}

export function calculateDeliveryFee(distance: number): number {
  // Simple distance-based delivery fee
  if (distance < 5) return 0; // Free for less than 5km
  if (distance < 10) return 50;
  if (distance < 20) return 100;
  return 150;
}

export function isWithinBusinessHours(time: Date): boolean {
  const hours = time.getHours();
  const openTime = parseInt(process.env.BUSINESS_OPEN_TIME?.split(":")[0] || "6");
  const closeTime = parseInt(process.env.BUSINESS_CLOSE_TIME?.split(":")[0] || "22");

  return hours >= openTime && hours < closeTime;
}

export function getNextDeliveryDate(isSameDay: boolean): Date {
  const now = new Date();
  const sameDayDeadline = parseInt(
    process.env.SAME_DAY_DELIVERY_DEADLINE?.split(":")[0] || "18"
  );

  if (isSameDay && now.getHours() < sameDayDeadline) {
    return now; // Same day delivery
  }

  // Next day delivery
  const nextDay = new Date(now);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);
  return nextDay;
}

export function calculateDiscount(
  originalPrice: number,
  discountPercent: number
): number {
  return Math.round(originalPrice * (1 - discountPercent / 100));
}
