/**
 * FlowerShop - Type Definitions for Products
 */

export interface Product {
  id: number;
  name: string;
  nameInTamil?: string;
  description: string;
  descriptionInTamil?: string;
  price: number;
  discountedPrice?: number;
  category: string;
  image: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  inStock: boolean;
  stockQuantity?: number;
  isFresh: boolean;
  freshnessInDays?: number;
  templeUsage?: string;
  isSeasonal: boolean;
  isFestivalSpecial?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  nameInTamil?: string;
  slug: string;
  image?: string;
  productCount: number;
  description?: string;
}

export interface ProductFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  inStockOnly?: boolean;
  festivalSpecials?: boolean;
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'rating';
  page?: number;
  limit?: number;
}
