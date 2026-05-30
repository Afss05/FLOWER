import React from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-normal ease-out cursor-pointer select-none focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-950 text-white hover:bg-gray-900 active:scale-95 shadow-base hover:shadow-md',
    secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:scale-95',
    accent: 'bg-accent-950 text-white hover:bg-rose-700 active:scale-95 shadow-base hover:shadow-md',
    ghost: 'text-primary-950 hover:bg-secondary-50 active:scale-95',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-5 py-3 text-base rounded-md',
    lg: 'px-6 py-4 text-lg rounded-xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...(props as MotionProps)}
    >
      {isLoading ? (
        <>
          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};
