export interface User {
  id: number;
  tenantId: string;
  email: string;
  phone: string;
  name: string;
  password: string;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  role: "customer" | "admin" | "super_admin";
  status: "active" | "inactive" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  tenantId: string;
  categoryId: number;
  name: string;
  descriptionEn: string;
  descriptionTa: string;
  templeUsage: string;
  sku: string;
  price: number;
  discountedPrice?: number;
  stockQuantity: number;
  minOrderQuantity: number;
  isFresh: boolean;
  freshnessdays?: number;
  isSeasonal: boolean;
  isFestivalSpecial: boolean;
  festivalId?: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  tenantId: string;
  userId: number;
  orderNumber: string;
  totalAmount: number;
  discountAmount: number;
  couponId?: number;
  deliveryFee: number;
  finalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "packing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  deliveryAddressId: number;
  deliveryDate: Date;
  deliverySlotId?: number;
  specialInstructions?: string;
  isSameDay: boolean;
  createdAt: Date;
  deliveredAt?: Date;
  updatedAt: Date;
}

export interface Payment {
  id: number;
  tenantId: string;
  orderId: number;
  userId: number;
  amount: number;
  method: "upi" | "card" | "wallet" | "cod";
  paymentGateway: "razorpay";
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  status: "pending" | "success" | "failed" | "refunded";
  refundAmount?: number;
  refundReason?: string;
  errorMessage?: string;
  createdAt: Date;
  paidAt?: Date;
  updatedAt: Date;
}

export interface Cart {
  id: number;
  userId: number;
  tenantId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  priceAtTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: number;
  tenantId: string;
  userId: number;
  name: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  price: number;
  productIds: number[];
  deliveryAddressId: number;
  deliverySlotId?: number;
  startDate: Date;
  endDate?: Date;
  nextDeliveryDate: Date;
  status: "active" | "paused" | "cancelled";
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  tenantId: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  parentId?: number;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Blog {
  id: number;
  tenantId: string;
  titleEn: string;
  titleTa: string;
  slug: string;
  contentEn: string;
  contentTa: string;
  excerptEn: string;
  excerptTa: string;
  featuredImage: string;
  authorId: number;
  status: "draft" | "published";
  publishedAt?: Date;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
