import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-12 w-full', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`bg-gradient-to-r from-secondary-100 via-secondary-50 to-secondary-100 rounded-md animate-shimmer ${className}`}
          style={{
            backgroundSize: '1000px 100%',
          }}
          initial={{ backgroundPosition: '-1000px 0' }}
          animate={{ backgroundPosition: '1000px 0' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="card space-y-4">
    <Skeleton className="h-48 w-full rounded-xl" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="flex gap-2 pt-4">
      <Skeleton className="h-10 flex-1 rounded-md" />
      <Skeleton className="h-10 flex-1 rounded-md" />
    </div>
  </div>
);

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
