import React from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  interactive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ interactive = false, children, className = '', ...props }) => {
  const baseStyles = 'bg-surface border border-border rounded-2xl p-6 transition-all duration-normal ease-out';
  const hoverStyles = interactive ? 'hover:border-border-strong hover:shadow-md cursor-pointer' : '';

  return (
    <motion.div
      whileHover={interactive ? { scale: 1.02, y: -4 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...(props as MotionProps)}
    >
      {children}
    </motion.div>
  );
};
