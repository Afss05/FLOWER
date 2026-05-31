import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { NotificationBell } from '../common/NotificationBell';

interface NavbarProps {
  logo?: string;
  onLoginClick?: () => void;
  onCartClick?: () => void;
  cartCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  logo = '🌸',
  onLoginClick,
  onCartClick,
  cartCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: 'Flowers', href: '#flowers' },
    { label: 'Occasions', href: '#occasions' },
    { label: 'Gifts', href: '#gifts' },
    { label: 'Plants', href: '#plants' },
    { label: 'Subscriptions', href: '#subscriptions' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'glass shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container-fluid">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-heading font-bold text-primary-950 flex items-center gap-2"
          >
            <span>{logo}</span>
            <span>FlowerShop</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                whileHover={{ color: '#E11D48' }}
                className="text-secondary-700 font-medium transition-colors duration-normal hover:text-accent-950"
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.button>

            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              title="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>

            {/* Notifications */}
            <NotificationBell />

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={onCartClick}
              className="relative p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              title="Cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 bg-accent-950 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Profile / Login */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              onClick={onLoginClick}
              title="Profile"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="md:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-secondary-50 border-t border-secondary-200"
          >
            <div className="flex flex-col gap-2 p-4">
              {navigationItems.map((item) => (
                <a key={item.label} href={item.href} className="px-4 py-2 rounded-lg hover:bg-secondary-100 transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
