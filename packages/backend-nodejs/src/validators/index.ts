import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const addressSchema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  addressLine1: z.string().min(5, "Address line 1 required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  postalCode: z.string().regex(/^[0-9]{6}$/, "Postal code must be 6 digits"),
  locationType: z.enum(["home", "office", "temple"]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().min(1),
    })
  ),
  deliveryAddressId: z.number().int().positive(),
  deliveryDate: z.string().datetime(),
  deliverySlotId: z.number().int().optional(),
  specialInstructions: z.string().optional(),
  isSameDay: z.boolean().default(false),
  couponCode: z.string().optional(),
});

export const createProductSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(3),
  descriptionEn: z.string().min(10),
  descriptionTa: z.string().min(10),
  templeUsage: z.string().optional(),
  sku: z.string().min(3),
  price: z.number().positive(),
  discountedPrice: z.number().positive().optional(),
  stockQuantity: z.number().int().min(0),
  minOrderQuantity: z.number().int().min(1),
  isFresh: z.boolean().default(true),
  freshnessdays: z.number().int().optional(),
  isSeasonal: z.boolean().default(false),
  isFestivalSpecial: z.boolean().default(false),
});

export const createSubscriptionSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  price: z.number().positive(),
  productIds: z.array(z.number().int().positive()),
  deliveryAddressId: z.number().int().positive(),
  deliverySlotId: z.number().int().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
