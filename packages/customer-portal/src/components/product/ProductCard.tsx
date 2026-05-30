import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface ProductCardProps {
  id: number;
  image: string;
  name: string;
  price: number;
  discountedPrice?: number;
  rating: number;
  reviews: number;
  occasion?: string;
  isFresh?: boolean;
  isSpecial?: boolean;
  onAddToCart?: (id: number) => void;
  onWishlist?: (id: number) => void;
  isInWishlist?: boolean;
}

export default function ProductCard({
  id,
  image,
  name,
  price,
  discountedPrice,
  rating,
  reviews,
  occasion,
  isFresh,
  isSpecial,
  onAddToCart,
  onWishlist,
  isInWishlist = false,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discount = discountedPrice
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card interactive className="overflow-hidden h-full flex flex-col">
        {/* Image Container */}
        <div className="relative mb-4 overflow-hidden rounded-xl bg-secondary-100 aspect-square">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-100 via-secondary-50 to-secondary-100 animate-shimmer" />
          )}

          <motion.img
            src={image}
            alt={name}
            onLoad={() => setImageLoaded(true)}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isSpecial && <Badge variant="accent">Festival Special</Badge>}
            {isFresh && <Badge variant="success">Fresh Today</Badge>}
            {discount > 0 && (
              <Badge variant="warning">{discount}% OFF</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onWishlist?.(id)}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-normal ${
              isInWishlist
                ? 'bg-accent-950 text-white'
                : 'bg-white/80 text-secondary-900 hover:bg-white'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isInWishlist ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </motion.button>

          {/* Quick Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent"
          >
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => onAddToCart?.(id)}
            >
              Quick Add
            </Button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          {occasion && (
            <p className="text-xs text-secondary-500 uppercase tracking-wide mb-1">
              {occasion}
            </p>
          )}

          <h3 className="text-sm font-heading font-semibold text-secondary-900 mb-2 line-clamp-2">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? 'text-warning'
                      : 'text-secondary-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-secondary-600">
              ({reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            {discountedPrice ? (
              <>
                <span className="text-lg font-heading font-bold text-secondary-900">
                  ₹{discountedPrice}
                </span>
                <span className="text-sm text-secondary-500 line-through">
                  ₹{price}
                </span>
              </>
            ) : (
              <span className="text-lg font-heading font-bold text-secondary-900">
                ₹{price}
              </span>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mt-4 pt-4 border-t border-secondary-100">
          <div className="flex items-center gap-2 text-xs text-secondary-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Next day delivery available</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
