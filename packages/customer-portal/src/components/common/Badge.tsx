import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children, className = '' }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-900',
    accent: 'bg-accent-100 text-accent-900',
    success: 'bg-green-100 text-green-900',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };

  return (
    <motion.span
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </motion.span>
  );
};
