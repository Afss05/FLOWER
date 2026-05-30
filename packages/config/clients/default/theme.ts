/**
 * FlowerShop - Default Client Configuration
 * 
 * This is the base/default theme configuration that can be overridden
 * by individual client configurations.
 */

export const themeConfig = {
  name: 'Chennai Pookkadai',
  
  colors: {
    primary: '#8B0000',              // Deep Maroon
    secondary: '#D4AF37',            // Gold
    accent: '#F5F5DC',               // Cream
    background: '#FFFFFF',
    text: '#2D2D2D',
    textLight: '#666666',
    border: '#E5E5E5',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    decorative: "'Georgia', serif",
  },
  
  assets: {
    logo: '/assets/logo.svg',
    logoLight: '/assets/logo-light.svg',
    favicon: '/assets/favicon.ico',
    heroImage: '/assets/hero.jpg',
    defaultProductImage: '/assets/default-product.jpg',
  },
  
  businessConfig: {
    businessName: 'Chennai Pookkadai',
    openTime: '06:00',
    closeTime: '22:00',
    nextDayDeliveryTime: '10:00',
    sameDayDeliveryDeadline: '18:00',
    minOrderValue: 299,
    deliveryFee: 49,
    freeDeliveryAbove: 999,
  },
  
  paymentMethods: ['upi', 'card', 'wallet', 'cod'],
  
  languages: {
    default: 'en',
    supported: ['en', 'ta'],
    names: {
      en: 'English',
      ta: 'Tamil',
    },
  },
  
  features: {
    subscriptionEnabled: true,
    wishlistEnabled: true,
    reviewsEnabled: true,
    recommendationsEnabled: true,
    sameDayDeliveryEnabled: true,
    blogEnabled: true,
  },
};

export type ThemeConfig = typeof themeConfig;
