import React from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  helpText,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-900 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-500">
            {icon}
          </div>
        )}
        <motion.input
          whileFocus={{ boxShadow: '0 0 0 3px rgba(15, 23, 42, 0.1)' }}
          className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} rounded-md border border-secondary-200 font-body text-base bg-white transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-950 placeholder-secondary-400 ${
            error ? 'border-error ring-1 ring-error' : ''
          } ${className}`}
          {...(props as MotionProps)}
        />
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-error mt-2">
          {error}
        </motion.p>
      )}
      {helpText && !error && (
        <p className="text-sm text-secondary-500 mt-2">
          {helpText}
        </p>
      )}
    </div>
  );
};
