# FlowerShop - Complete Development Guide

Production-ready South Indian flower and pooja eCommerce platform with multi-tenant architecture.

## Project Overview

**FlowerShop** is a modern, scalable flower and pooja item delivery platform inspired by Chennai Pookkadai. It supports:

- Fresh flower ordering with same-day delivery
- Pooja item and ritual product offerings
- Subscription-based flower delivery plans
- Festival-special product management
- Multi-tenant architecture (support for multiple flower shop clients)
- Admin management system for inventory and orders
- SEO-optimized content and blogs
- Bilingual support (English + Tamil)
- Razorpay payment integration

## Architecture Overview

```
FlowerShop/
├── packages/
│   ├── customer-portal/     # Customer-facing React app (port 5173)
│   ├── admin-dashboard/     # Admin portal React app (port 5174)
│   ├── backend-nodejs/      # Node.js/Express REST API (port 8000)
│   └── config/              # Shared configuration & client-specific configs
├── docs-site/               # Documentation website
├── e2e/                      # End-to-end tests (Playwright)
└── CLAUDE.md               # This file
```

## Technology Stack

### Frontend (Both Portals)

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router v7** for routing
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for server state
- **Axios** for API calls
- **React Hook Form** + **Zod** for form validation
- **Framer Motion** for animations
- **i18next** for multi-language support

### Backend

- **Node.js 18+** runtime
- **Express.js 4.18** REST API
- **TypeScript 5.3** for type safety
- **MySQL 8.0** for database
- **Sequelize 6.35** ORM for database models
- **JWT (jsonwebtoken)** for authentication
- **Service Layer** for business logic
- **Event-Driven** architecture for notifications
- **Repository Pattern** architecture

### DevOps & Deployment

- **No AWS** services
- **Frontend**: Vercel or Netlify
- **Backend**: Ubuntu VPS with Nginx + PHP-FPM

## Multi-Tenant Architecture

### Build-Time Configuration

```env
CLIENT_ID=default  # Client identifier (e.g., "default", "yw-flowers", "cadent-flowers")
```

### Database Schema

```
Schema per tenant: {CLIENT_ID}_public
Example: default_public, yw-flowers_public, cadent-flowers_public
```

### Directory Structure for Clients

```
packages/config/clients/
├── default/                          # Default client config
│   ├── theme.ts                      # Brand colors, fonts, assets
│   ├── private-config.ts             # API keys, service configs
│   ├── pages/
│   │   ├── home.ts
│   │   └── products.ts
│   ├── forms/                        # Client-specific forms
│   └── workflows/                    # Client-specific workflows
├── yw-flowers/                       # Yorkshire Water Flowers client
│   ├── theme.ts
│   ├── private-config.ts
│   └── ...
```

### Theme Configuration Pattern

```typescript
// config/clients/{CLIENT_ID}/theme.ts
export const themeConfig = {
  colors: {
    primary: "#8B0000", // Maroon for traditional feel
    secondary: "#D4AF37", // Gold
    accent: "#F5F5DC", // Cream
    background: "#FFFFFF",
    text: "#2D2D2D",
  },
  fonts: {
    primary: "Inter, sans-serif",
    decorative: "Georgia, serif",
  },
  assets: {
    logo: "/assets/logo.png",
    favicon: "/assets/favicon.ico",
    heroImage: "/assets/hero.jpg",
  },
  businessHours: {
    openTime: "06:00",
    closeTime: "22:00",
    nextDayDeliveryTime: "10:00",
  },
  paymentMethods: ["upi", "card", "wallet", "cod"],
  defaultLanguage: "en", // 'en' or 'ta'
};
```

## Frontend Architecture

### Directory Structure - Customer Portal

```
packages/customer-portal/src/
├── api/
│   ├── client.ts                     # Axios instance & interceptors
│   ├── auth.ts                       # Auth endpoints
│   ├── products.ts                   # Products endpoints
│   ├── cart.ts                       # Cart endpoints
│   ├── orders.ts                     # Orders endpoints
│   ├── payments.ts                   # Payment endpoints
│   └── subscriptions.ts              # Subscription endpoints
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/
│   ├── common/                       # Reusable components
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── Loader.tsx
│   │   ├── Modal.tsx
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   │
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilter.tsx
│   │   └── RelatedProducts.tsx
│   │
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── EmptyCart.tsx
│   │
│   ├── checkout/
│   │   ├── AddressForm.tsx
│   │   ├── DeliverySlots.tsx
│   │   ├── PaymentMethod.tsx
│   │   ├── OrderReview.tsx
│   │   └── RazorpayButton.tsx
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── OTPVerification.tsx
│   │   └── ForgotPassword.tsx
│   │
│   ├── home/
│   │   ├── HeroSlider.tsx
│   │   ├── FeaturedCategories.tsx
│   │   ├── TrendingProducts.tsx
│   │   ├── FestivalSpecials.tsx
│   │   ├── SubscriptionPlans.tsx
│   │   └── BlogSection.tsx
│   │
│   ├── forms/
│   │   ├── SubscriptionForm.tsx
│   │   ├── ReviewForm.tsx
│   │   └── NewsletterForm.tsx
│   │
│   └── layout/
│       ├── MainLayout.tsx
│       ├── AuthLayout.tsx
│       └── LanguageSwitch.tsx
│
├── pages/
│   ├── home/
│   │   └── HomePage.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── OTPPage.tsx
│   │   └── ForgotPasswordPage.tsx
│   ├── products/
│   │   ├── ProductListingPage.tsx
│   │   └── ProductDetailsPage.tsx
│   ├── cart/
│   │   └── CartPage.tsx
│   ├── checkout/
│   │   └── CheckoutPage.tsx
│   ├── payment/
│   │   └── PaymentPage.tsx
│   ├── profile/
│   │   ├── ProfilePage.tsx
│   │   ├── AddressesPage.tsx
│   │   └── SettingsPage.tsx
│   ├── orders/
│   │   ├── OrdersPage.tsx
│   │   ├── OrderDetailsPage.tsx
│   │   └── OrderTrackingPage.tsx
│   ├── subscriptions/
│   │   ├── SubscriptionsPage.tsx
│   │   └── SubscriptionDetailsPage.tsx
│   ├── wishlist/
│   │   └── WishlistPage.tsx
│   ├── blogs/
│   │   ├── BlogListPage.tsx
│   │   └── BlogDetailPage.tsx
│   └── not-found/
│       └── NotFoundPage.tsx
│
├── hooks/
│   ├── queries/
│   │   ├── useProducts.ts
│   │   ├── useCategories.ts
│   │   ├── useOrders.ts
│   │   ├── useCart.ts
│   │   └── useUser.ts
│   │
│   ├── mutations/
│   │   ├── useCreateOrder.ts
│   │   ├── useAddToCart.ts
│   │   ├── useUpdateProfile.ts
│   │   └── useCreateSubscription.ts
│   │
│   └── useAuth.ts                    # Auth context hook
│
├── store/
│   ├── authStore.ts                  # Zustand for auth state
│   ├── cartStore.ts                  # Cart state (local + server sync)
│   ├── filterStore.ts                # Product filter state
│   ├── uiStore.ts                    # UI state (modals, theme, language)
│   └── notificationStore.ts          # Toast/notification state
│
├── layouts/
│   ├── RootLayout.tsx
│   ├── DashboardLayout.tsx
│   └── CheckoutLayout.tsx
│
├── routes/
│   ├── index.tsx                     # Route definitions
│   └── protectedRoute.tsx            # Protected route wrapper
│
├── services/
│   ├── localStorage.ts               # Local storage utilities
│   ├── sessionStorage.ts             # Session storage utilities
│   └── notification.ts               # Toast notification service
│
├── utils/
│   ├── formatters.ts                 # Format numbers, dates, currency
│   ├── validators.ts                 # Custom validation functions
│   ├── helpers.ts                    # General helpers
│   ├── constants.ts                  # App constants
│   ├── themes.ts                     # Theme utilities
│   └── i18n.ts                       # i18next configuration
│
├── validations/
│   ├── auth.ts                       # Auth form schemas (Zod)
│   ├── product.ts                    # Product schemas
│   ├── checkout.ts                   # Checkout schemas
│   ├── address.ts                    # Address schemas
│   └── payment.ts                    # Payment schemas
│
├── constants/
│   ├── api.ts                        # API endpoints
│   ├── festivals.ts                  # Festival calendar data
│   ├── deliverySlots.ts              # Available delivery slots
│   ├── messages.ts                   # Error/success messages
│   └── routes.ts                     # Frontend routes
│
├── types/
│   ├── index.ts                      # Type exports
│   ├── product.ts                    # Product types
│   ├── order.ts                      # Order types
│   ├── user.ts                       # User types
│   ├── payment.ts                    # Payment types
│   ├── api.ts                        # API response types
│   └── forms.ts                      # Form field types
│
├── config/
│   ├── queryClient.ts                # React Query configuration
│   └── axiosConfig.ts                # Axios defaults
│
├── App.tsx
├── main.tsx
└── index.css
```

### Directory Structure - Admin Dashboard

```
packages/admin-dashboard/src/
├── api/
│   ├── auth.ts
│   ├── products.ts
│   ├── categories.ts
│   ├── orders.ts
│   ├── users.ts
│   ├── coupons.ts
│   ├── blogs.ts
│   ├── subscriptions.ts
│   └── analytics.ts
│
├── components/
│   ├── common/
│   ├── forms/
│   │   ├── ProductForm.tsx
│   │   ├── CategoryForm.tsx
│   │   ├── CouponForm.tsx
│   │   ├── BlogForm.tsx
│   │   └── SubscriptionForm.tsx
│   │
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── OrdersChart.tsx
│   │   ├── InventoryAlert.tsx
│   │   └── RecentOrders.tsx
│   │
│   ├── tables/
│   │   ├── ProductTable.tsx
│   │   ├── OrderTable.tsx
│   │   ├── UserTable.tsx
│   │   ├── CouponTable.tsx
│   │   └── BlogTable.tsx
│   │
│   └── layout/
│       ├── Sidebar.tsx
│       ├── TopBar.tsx
│       └── AdminLayout.tsx
│
├── pages/
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── products/
│   │   ├── ProductListPage.tsx
│   │   ├── CreateProductPage.tsx
│   │   ├── EditProductPage.tsx
│   │   └── ProductDetailsPage.tsx
│   ├── categories/
│   │   ├── CategoryListPage.tsx
│   │   ├── CreateCategoryPage.tsx
│   │   └── EditCategoryPage.tsx
│   ├── orders/
│   │   ├── OrderListPage.tsx
│   │   ├── OrderDetailsPage.tsx
│   │   └── InvoicePreviewPage.tsx
│   ├── users/
│   │   ├── UserListPage.tsx
│   │   └── UserDetailsPage.tsx
│   ├── coupons/
│   │   ├── CouponListPage.tsx
│   │   ├── CreateCouponPage.tsx
│   │   └── EditCouponPage.tsx
│   ├── blogs/
│   │   ├── BlogListPage.tsx
│   │   ├── CreateBlogPage.tsx
│   │   └── EditBlogPage.tsx
│   ├── subscriptions/
│   │   ├── SubscriptionListPage.tsx
│   │   └── SubscriptionDetailsPage.tsx
│   ├── analytics/
│   │   ├── RevenueAnalyticsPage.tsx
│   │   ├── ProductAnalyticsPage.tsx
│   │   └── CustomerAnalyticsPage.tsx
│   └── settings/
│       ├── GeneralSettingsPage.tsx
│       ├── DeliverySettingsPage.tsx
│       └── NotificationSettingsPage.tsx
│
├── hooks/
│   ├── queries/
│   ├── mutations/
│   └── admin-specific hooks
│
├── store/
│   ├── adminStore.ts                 # Admin state
│   ├── filterStore.ts
│   └── sidebarStore.ts               # Sidebar expand/collapse
│
├── utils/
│   ├── exportData.ts                 # CSV/PDF export utilities
│   ├── formatters.ts
│   └── validators.ts
│
├── types/
│   └── admin.ts                      # Admin-specific types
│
└── App.tsx
```

### Key Frontend Patterns

#### API Client Setup

```typescript
// api/client.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 - refresh token logic
    // Handle other errors
  },
);

export default apiClient;
```

#### React Query Hook Pattern

```typescript
// hooks/queries/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products";

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

#### Form Validation Pattern (Zod)

```typescript
// validations/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
});
```

#### Zustand State Management

```typescript
// store/authStore.ts
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // Login logic
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },
  refreshToken: async () => {
    // Refresh token logic
  },
}));
```

## Backend Architecture

### Directory Structure - Node.js/Express

```
packages/backend-nodejs/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthController.php
│   │   │   │   └── PasswordController.php
│   │   │   ├── Product/
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   └── ProductImageController.php
│   │   │   ├── Cart/
│   │   │   │   └── CartController.php
│   │   │   ├── Order/
│   │   │   │   ├── OrderController.php
│   │   │   │   └── OrderTrackingController.php
│   │   │   ├── Payment/
│   │   │   │   └── PaymentController.php
│   │   │   ├── User/
│   │   │   │   ├── UserController.php
│   │   │   │   ├── AddressController.php
│   │   │   │   └── WishlistController.php
│   │   │   ├── Subscription/
│   │   │   │   └── SubscriptionController.php
│   │   │   ├── Coupon/
│   │   │   │   └── CouponController.php
│   │   │   ├── Blog/
│   │   │   │   └── BlogController.php
│   │   │   └── Admin/
│   │   │       ├── DashboardController.php
│   │   │       ├── AdminProductController.php
│   │   │       ├── AdminOrderController.php
│   │   │       ├── AdminUserController.php
│   │   │       └── AdminAnalyticsController.php
│   │   │
│   │   ├── Middleware/
│   │   │   ├── AuthMiddleware.php
│   │   │   ├── TenantMiddleware.php
│   │   │   ├── AdminMiddleware.php
│   │   │   ├── RateLimitMiddleware.php
│   │   │   └── CORSMiddleware.php
│   │   │
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   └── ChangePasswordRequest.php
│   │   │   ├── Product/
│   │   │   │   ├── StoreProductRequest.php
│   │   │   │   └── UpdateProductRequest.php
│   │   │   ├── Order/
│   │   │   │   └── StoreOrderRequest.php
│   │   │   └── ...
│   │   │
│   │   └── Resources/
│   │       ├── UserResource.php
│   │       ├── ProductResource.php
│   │       ├── OrderResource.php
│   │       ├── CartResource.php
│   │       ├── SubscriptionResource.php
│   │       └── ...
│   │
│   ├── Models/
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Category.php
│   │   ├── ProductImage.php
│   │   ├── Cart.php
│   │   ├── CartItem.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   │   ├── Payment.php
│   │   ├── Address.php
│   │   ├── Wishlist.php
│   │   ├── Subscription.php
│   │   ├── SubscriptionDelivery.php
│   │   ├── Coupon.php
│   │   ├── Blog.php
│   │   ├── Review.php
│   │   ├── DeliverySlot.php
│   │   ├── Notification.php
│   │   └── Tenant.php
│   │
│   ├── Repositories/
│   │   ├── Contracts/
│   │   │   ├── ProductRepositoryContract.php
│   │   │   ├── OrderRepositoryContract.php
│   │   │   ├── UserRepositoryContract.php
│   │   │   └── ...
│   │   │
│   │   ├── ProductRepository.php
│   │   ├── OrderRepository.php
│   │   ├── CartRepository.php
│   │   ├── UserRepository.php
│   │   ├── SubscriptionRepository.php
│   │   ├── PaymentRepository.php
│   │   └── ...
│   │
│   ├── Services/
│   │   ├── Auth/
│   │   │   ├── AuthService.php
│   │   │   ├── OTPService.php
│   │   │   └── PasswordResetService.php
│   │   │
│   │   ├── Product/
│   │   │   ├── ProductService.php
│   │   │   ├── CategoryService.php
│   │   │   ├── SearchService.php
│   │   │   ├── RecommendationService.php
│   │   │   └── ImageUploadService.php
│   │   │
│   │   ├── Order/
│   │   │   ├── OrderService.php
│   │   │   ├── OrderTrackingService.php
│   │   │   └── InvoiceService.php
│   │   │
│   │   ├── Payment/
│   │   │   ├── RazorpayService.php
│   │   │   └── PaymentService.php
│   │   │
│   │   ├── Cart/
│   │   │   └── CartService.php
│   │   │
│   │   ├── Subscription/
│   │   │   ├── SubscriptionService.php
│   │   │   └── SubscriptionDeliveryService.php
│   │   │
│   │   ├── Notification/
│   │   │   ├── EmailService.php
│   │   │   ├── SMSService.php
│   │   │   └── NotificationService.php
│   │   │
│   │   ├── Analytics/
│   │   │   ├── AnalyticsService.php
│   │   │   ├── RevenueService.php
│   │   │   └── InventoryService.php
│   │   │
│   │   └── Tenant/
│   │       └── TenantService.php
│   │
│   ├── Events/
│   │   ├── OrderCreated.php
│   │   ├── OrderStatusChanged.php
│   │   ├── PaymentSuccessful.php
│   │   ├── PaymentFailed.php
│   │   ├── SubscriptionCreated.php
│   │   ├── SubscriptionCancelled.php
│   │   └── ...
│   │
│   ├── Jobs/
│   │   ├── ProcessSubscriptionDelivery.php
│   │   ├── SendOrderConfirmation.php
│   │   ├── SendDeliveryNotification.php
│   │   ├── GenerateInvoice.php
│   │   ├── SyncPaymentStatus.php
│   │   └── UpdateInventory.php
│   │
│   ├── Listeners/
│   │   ├── SendOrderConfirmationEmail.php
│   │   ├── UpdateInventoryOnOrder.php
│   │   ├── NotifyAdminOrderCreated.php
│   │   ├── ProcessPaymentEvent.php
│   │   └── ...
│   │
│   ├── Notifications/
│   │   ├── OrderConfirmation.php
│   │   ├── OrderStatusNotification.php
│   │   ├── SubscriptionReminder.php
│   │   ├── PaymentConfirmation.php
│   │   └── DeliveryNotification.php
│   │
│   ├── Traits/
│   │   ├── TenantTrait.php              # Automatically scope queries to tenant
│   │   ├── FilterableTrait.php          # Support filtering in queries
│   │   ├── SortableTrait.php            # Support sorting in queries
│   │   └── PaginatableTrait.php         # Support pagination
│   │
│   ├── Helpers/
│   │   ├── ResponseHelper.php           # API response formatting
│   │   ├── FileUploadHelper.php         # File upload utilities
│   │   ├── DateHelper.php               # Date formatting utilities
│   │   └── TenantHelper.php             # Tenant utilities
│   │
│   ├── Exceptions/
│   │   ├── TenantNotFoundException.php
│   │   ├── PaymentFailedException.php
│   │   ├── InvalidDeliverySlotException.php
│   │   └── InventoryExceededException.php
│   │
│   └── Observers/
│       ├── ProductObserver.php          # Log product changes
│       ├── OrderObserver.php            # Log order changes
│       └── ...
│
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000000_create_tenants_table.php
│   │   ├── 2024_01_01_000001_create_users_table.php
│   │   ├── 2024_01_01_000002_create_categories_table.php
│   │   ├── 2024_01_01_000003_create_products_table.php
│   │   ├── 2024_01_01_000004_create_product_images_table.php
│   │   ├── 2024_01_01_000005_create_carts_table.php
│   │   ├── 2024_01_01_000006_create_cart_items_table.php
│   │   ├── 2024_01_01_000007_create_orders_table.php
│   │   ├── 2024_01_01_000008_create_order_items_table.php
│   │   ├── 2024_01_01_000009_create_payments_table.php
│   │   ├── 2024_01_01_000010_create_addresses_table.php
│   │   ├── 2024_01_01_000011_create_wishlist_table.php
│   │   ├── 2024_01_01_000012_create_subscriptions_table.php
│   │   ├── 2024_01_01_000013_create_subscription_deliveries_table.php
│   │   ├── 2024_01_01_000014_create_delivery_slots_table.php
│   │   ├── 2024_01_01_000015_create_coupons_table.php
│   │   ├── 2024_01_01_000016_create_blogs_table.php
│   │   ├── 2024_01_01_000017_create_reviews_table.php
│   │   └── ...
│   │
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── TenantSeeder.php
│   │   ├── UserSeeder.php
│   │   ├── CategorySeeder.php
│   │   ├── ProductSeeder.php
│   │   ├── DeliverySlotSeeder.php
│   │   ├── CouponSeeder.php
│   │   ├── FestivalSeeder.php
│   │   └── ...
│   │
│   └── factories/
│       ├── UserFactory.php
│       ├── ProductFactory.php
│       ├── OrderFactory.php
│       ├── SubscriptionFactory.php
│       └── ...
│
├── routes/
│   ├── api.php                         # API routes
│   ├── web.php                         # Web routes
│   └── channels.php                    # Broadcasting channels
│
├── config/
│   ├── app.php
│   ├── database.php
│   ├── mail.php
│   ├── queue.php
│   ├── filesystems.php
│   ├── services.php                    # Third-party service configs
│   ├── sanctum.php                     # Laravel Sanctum config
│   ├── tenancy.php                     # Multi-tenancy config
│   └── ...
│
├── storage/
│   ├── app/
│   │   └── uploads/                    # User uploads
│   │       ├── products/
│   │       ├── blogs/
│   │       └── users/
│   │
│   ├── logs/
│   └── ...
│
├── tests/
│   ├── Unit/
│   │   ├── Services/
│   │   ├── Repositories/
│   │   └── Helpers/
│   │
│   ├── Feature/
│   │   ├── Auth/
│   │   ├── Product/
│   │   ├── Order/
│   │   └── Payment/
│   │
│   └── Pest.php                        # Pest test setup
│
├── .env.example
├── .env.testing
├── artisan
├── composer.json
└── README.md
```

### Backend Key Features

#### Authentication (JWT)

```typescript
// AuthController.ts
async login(req: AuthRequest, res: Response) {
  // Validate credentials
  // Create JWT token
  // Return user + token
}

async refresh(req: AuthRequest, res: Response) {
  // Refresh token logic
}

async logout(req: AuthRequest, res: Response) {
  // Invalidate token (optional for JWT)
}
```

#### Repository Pattern

```typescript
// ProductRepository.ts
class ProductRepository {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    let query = Product.findAll();
    
    if (filters?.categoryId) {
      query = await query.where({ categoryId: filters.categoryId });
    }
    
    if (filters?.search) {
      query = await query.where({ name: { [Op.like]: `%${filters.search}%` } });
    }
    
    return query.limit(15).offset(0);
  }
  
  async getById(id: number): Promise<Product | null> {
    return Product.findByPk(id);
  }
}
```

#### Multi-Tenancy

```typescript
// authenticate.ts Middleware - Extract tenant context
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  const tenantId = req.user?.tenantId || process.env.CLIENT_ID || 'default';
  
  req.tenantId = tenantId;
  next();
};

// Sequelize model hook - Scope queries to current tenant
Product.addHook('afterFind', (products: any) => {
  if (!Array.isArray(products)) products = [products];
  return products.filter(p => p.tenantId === getTenant());
});
```

#### Service Layer

```typescript
// services/OrderService.ts
class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private inventoryService: InventoryService,
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) {}

  async createOrder(request: CreateOrderRequest, user: User): Promise<Order> {
    // Validate inventory
    await this.inventoryService.validateStock(request.items);

    // Create order
    const order = await this.orderRepository.create({
      userId: user.id,
      items: request.items,
      // ...
    });

    // Emit event
    EventEmitter.emit('order:created', order);

    // Queue async job
    await queueJob('process-subscription-delivery', { orderId: order.id });

    return order;
  }
}
```

## Database Schema

### Core Tables

```sql
-- Multi-tenancy
tenants
├── id
├── slug (unique subdomain identifier)
├── business_name
├── created_at

-- Authentication & Users
users
├── id
├── tenant_id (FK)
├── email (unique per tenant)
├── phone
├── name
├── password
├── email_verified_at
├── phone_verified_at
├── role (customer, admin, super_admin)
├── status (active, inactive, suspended)
├── created_at

-- Products
categories
├── id
├── tenant_id (FK)
├── name
├── slug
├── description
├── image_url
├── parent_id (for nested categories)
├── display_order
├── created_at

products
├── id
├── tenant_id (FK)
├── category_id (FK)
├── name
├── description_en
├── description_ta
├── temple_usage
├── sku
├── price
├── discounted_price
├── stock_quantity
├── min_order_quantity
├── is_fresh
├── freshness_days
├── is_seasonal
├── is_festival_special
├── festival_id (FK)
├── rating
├── review_count
├── created_at

product_images
├── id
├── product_id (FK)
├── image_url
├── alt_text
├── display_order
├── created_at

-- Cart
carts
├── id
├── user_id (FK)
├── tenant_id (FK)
├── expires_at
├── created_at

cart_items
├── id
├── cart_id (FK)
├── product_id (FK)
├── quantity
├── price_at_time
├── created_at

-- Orders
orders
├── id
├── tenant_id (FK)
├── user_id (FK)
├── order_number (unique per tenant)
├── total_amount
├── discount_amount
├── coupon_id (FK)
├── delivery_fee
├── final_amount
├── status (pending, confirmed, packing, out_for_delivery, delivered, cancelled)
├── delivery_address_id (FK)
├── delivery_date
├── delivery_slot_id (FK)
├── special_instructions
├── is_same_day
├── created_at
├── delivered_at

order_items
├── id
├── order_id (FK)
├── product_id (FK)
├── quantity
├── price
├── subtotal
├── created_at

-- Payments
payments
├── id
├── tenant_id (FK)
├── order_id (FK)
├── user_id (FK)
├── amount
├── method (upi, card, wallet, cod)
├── payment_gateway (razorpay)
├── gateway_order_id
├── gateway_payment_id
├── status (pending, success, failed, refunded)
├── refund_amount
├── refund_reason
├── error_message
├── created_at
├── paid_at

-- User Addresses
addresses
├── id
├── user_id (FK)
├── tenant_id (FK)
├── name
├── phone
├── address_line_1
├── address_line_2
├── city
├── state
├── postal_code
├── location_type (home, office, temple)
├── is_default
├── latitude
├── longitude
├── created_at

-- Subscriptions
subscriptions
├── id
├── tenant_id (FK)
├── user_id (FK)
├── name
├── description
├── frequency (daily, weekly, monthly)
├── price
├── product_ids (JSON array)
├── delivery_address_id (FK)
├── delivery_slot_id (FK)
├── start_date
├── end_date
├── next_delivery_date
├── status (active, paused, cancelled)
├── cancellation_reason
├── created_at

subscription_deliveries
├── id
├── subscription_id (FK)
├── delivery_date
├── status (scheduled, delivered, cancelled)
├── order_id (FK)
├── created_at

-- Other Features
wishlists
├── id
├── user_id (FK)
├── tenant_id (FK)
├── product_id (FK)
├── created_at

coupons
├── id
├── tenant_id (FK)
├── code (unique per tenant)
├── discount_type (fixed, percentage)
├── discount_value
├── max_uses
├── used_count
├── min_amount
├── applicable_categories (JSON)
├── start_date
├── end_date
├── created_at

delivery_slots
├── id
├── tenant_id (FK)
├── start_time
├── end_time
├── max_deliveries
├── current_bookings
├── is_available
├── created_at

blogs
├── id
├── tenant_id (FK)
├── title_en
├── title_ta
├── slug
├── content_en
├── content_ta
├── excerpt_en
├── excerpt_ta
├── featured_image
├── author_id (FK)
├── status (draft, published)
├── published_at
├── seo_title
├── seo_description
├── seo_keywords
├── created_at

reviews
├── id
├── tenant_id (FK)
├── product_id (FK)
├── user_id (FK)
├── order_id (FK)
├── rating (1-5)
├── title
├── comment
├── is_verified_purchase
├── helpful_count
├── created_at

delivery_slots
├── id
├── tenant_id (FK)
├── start_time
├── end_time
├── max_deliveries
├── is_available
├── created_at
```

## API Routes

### Authentication Routes

```
POST   /api/auth/register             → Register new user
POST   /api/auth/login                → Login user
POST   /api/auth/otp-send             → Send OTP
POST   /api/auth/otp-verify           → Verify OTP
POST   /api/auth/refresh              → Refresh token
POST   /api/auth/logout               → Logout
POST   /api/auth/forgot-password      → Request password reset
POST   /api/auth/reset-password       → Reset password
GET    /api/auth/me                   → Get current user
```

### Product Routes

```
GET    /api/products                  → List products (with filters)
GET    /api/products/{id}             → Get product details
GET    /api/categories                → List categories
GET    /api/categories/{id}           → Get category details
GET    /api/products/featured         → Get featured products
GET    /api/products/festival/{id}    → Get festival products
POST   /api/products/search           → Advanced search
GET    /api/products/{id}/related     → Get related products
GET    /api/products/{id}/reviews     → Get product reviews
```

### Cart Routes

```
GET    /api/cart                      → Get cart
POST   /api/cart/items                → Add to cart
PATCH  /api/cart/items/{id}           → Update cart item
DELETE /api/cart/items/{id}           → Remove from cart
DELETE /api/cart                      → Clear cart
```

### Order Routes

```
POST   /api/orders                    → Create order
GET    /api/orders                    → Get user orders
GET    /api/orders/{id}               → Get order details
PATCH  /api/orders/{id}               → Update order (cancel, etc.)
GET    /api/orders/{id}/tracking      → Get order tracking
GET    /api/orders/{id}/invoice       → Get order invoice
POST   /api/orders/{id}/return        → Request return
```

### Payment Routes

```
POST   /api/payments/razorpay         → Create Razorpay order
POST   /api/payments/verify           → Verify payment
GET    /api/payments/{id}             → Get payment details
POST   /api/payments/{id}/refund      → Request refund
```

### Subscription Routes

```
GET    /api/subscriptions             → List subscription plans
GET    /api/subscriptions/{id}        → Get plan details
POST   /api/user/subscriptions        → Create subscription
GET    /api/user/subscriptions        → Get user subscriptions
PATCH  /api/user/subscriptions/{id}   → Update subscription
DELETE /api/user/subscriptions/{id}   → Cancel subscription
```

### User Routes

```
GET    /api/user/profile              → Get user profile
PATCH  /api/user/profile              → Update profile
GET    /api/user/addresses            → Get addresses
POST   /api/user/addresses            → Add address
PATCH  /api/user/addresses/{id}       → Update address
DELETE /api/user/addresses/{id}       → Delete address
GET    /api/user/wishlist             → Get wishlist
POST   /api/user/wishlist/{id}        → Add to wishlist
DELETE /api/user/wishlist/{id}        → Remove from wishlist
```

### Blog Routes

```
GET    /api/blogs                     → List blogs
GET    /api/blogs/{slug}              → Get blog by slug
GET    /api/blogs/category/{slug}     → Get blogs by category
POST   /api/blogs/{id}/reviews        → Add blog comment
```

### Admin Routes

```
GET    /api/admin/dashboard           → Dashboard stats
POST   /api/admin/products            → Create product
PATCH  /api/admin/products/{id}       → Update product
DELETE /api/admin/products/{id}       → Delete product
GET    /api/admin/orders              → List all orders
PATCH  /api/admin/orders/{id}         → Update order status
GET    /api/admin/analytics           → Analytics data
POST   /api/admin/coupons             → Create coupon
POST   /api/admin/delivery-slots      → Manage slots
```

## Configuration Package

### Structure

```
packages/config/
├── clients/
│   ├── default/
│   │   ├── theme.ts                  # Brand configuration
│   │   ├── private-config.ts         # API keys (git-ignored)
│   │   ├── public-config.ts          # Public config
│   │   ├── pages/
│   │   │   ├── home.ts
│   │   │   ├── products.ts
│   │   │   └── ...
│   │   └── workflows/
│   │       ├── order-workflow.ts
│   │       └── ...
│   │
│   └── yw-flowers/
│       ├── theme.ts
│       ├── private-config.ts
│       └── ...
│
├── schema/
│   ├── theme.ts                      # Theme type definitions
│   ├── pages.ts                      # Page content schema
│   └── workflows.ts                  # Workflow schema
│
├── index.ts                          # Barrel exports
└── README.md
```

### Theme Configuration Example

```typescript
// config/clients/default/theme.ts
export const theme = {
  name: "Chennai Pookkadai",
  colors: {
    primary: "#8B0000", // Maroon
    secondary: "#D4AF37", // Gold
    accent: "#F5F5DC", // Cream
    background: "#FFFFFF",
    text: "#2D2D2D",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  fonts: {
    primary: "'Inter', sans-serif",
    decorative: "'Georgia', serif",
  },
  assets: {
    logo: "/assets/logo.svg",
    favicon: "/assets/favicon.ico",
    heroImage: "/assets/hero.jpg",
  },
  businessConfig: {
    openTime: "06:00",
    closeTime: "22:00",
    nextDayDeliveryTime: "10:00",
    sameDayDeliveryDeadline: "18:00",
  },
  defaultLanguage: "en",
  supportedLanguages: ["en", "ta"],
};
```

## Environment Variables

### Root `.env` Setup

```env
# Client configuration
CLIENT_ID=default

# Frontend - Auto-distributed
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=FlowerShop
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx

# Backend - Auto-distributed
APP_NAME=FlowerShop
APP_ENV=local
APP_KEY=base64:xxxxx
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=flowershop_default_public
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:5174,localhost:8000
SESSION_DOMAIN=localhost

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=xxxxx
MAIL_PASSWORD=xxxxx
MAIL_FROM_ADDRESS=noreply@flowershop.local

RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

QUEUE_CONNECTION=database
```

### Multi-Client Setup

```env
# For YW Flowers client
CLIENT_ID=yw-flowers

DB_DATABASE=flowershop_yw_flowers_public
VITE_API_URL=http://localhost:8000/api
RAZORPAY_KEY_ID=rzp_test_yw_xxxxx
```

## Development Workflow

### Setup

```bash
# Clone repository
git clone <repo>
cd FlowerShop

# Install dependencies
npm install  # or pnpm install

# Setup environment
cp .env.example .env
cp packages/backend/.env.example packages/backend/.env

# Database setup (Laravel)
cd packages/backend
php artisan migrate
php artisan db:seed

# Start development servers
cd ../..
npm run dev

# This starts:
# - Frontend (customer-portal): http://localhost:5173
# - Admin (admin-dashboard): http://localhost:5174
# - Backend API: http://localhost:8000
```

### Common Commands

```bash
# Frontend development
pnpm --filter @flowershop/customer-portal dev
pnpm --filter @flowershop/admin-dashboard dev

# Backend development
cd packages/backend-nodejs
pnpm dev

# Run tests
pnpm test                    # Frontend and backend tests

# Code quality
pnpm lint                  # Linting
pnpm format                # Code formatting

# Type checking
cd packages/backend-nodejs
npx tsc --noEmit           # Check TypeScript
```

## Testing Strategy

### Frontend (Vitest + React Testing Library)

```typescript
// components/__tests__/ProductCard.test.tsx
describe('ProductCard', () => {
  it('renders product with correct details', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Rose Flowers')).toBeInTheDocument();
  });

  it('adds product to cart on button click', async () => {
    const { user } = render(<ProductCard product={mockProduct} />);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(useCartStore().items).toHaveLength(1);
  });
});
```

### Backend (Pest PHP)

```php
// tests/Feature/ProductTest.php
it('retrieves products with filters', function () {
    Product::factory(5)->create();

    $response = $this->getJson('/api/products?category=flowers');

    $response->assertStatus(200)
        ->assertJsonCount(5, 'data');
});
```

## Deployment

### Frontend (Vercel/Netlify)

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

### Backend (Ubuntu VPS)

```bash
# SSH into server
ssh user@server

# Clone and setup
git clone <repo>
cd FlowerShop/packages/backend

# Install dependencies
composer install --no-dev

# Setup environment
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate --force

# Nginx configuration
# Point to /public directory
# Setup SSL with Certbot
```

## Security Best Practices

1. **Input Validation**: Always validate on both frontend and backend
2. **Authentication**: Use Laravel Sanctum for API token management
3. **CORS**: Configure properly for frontend origins
4. **Rate Limiting**: Implement on sensitive endpoints
5. **SQL Injection**: Use parameterized queries (handled by Eloquent ORM)
6. **XSS Protection**: Sanitize user input
7. **CSRF Protection**: Use Laravel's built-in CSRF middleware
8. **Secure Headers**: Implement security headers

## Performance Optimization

### Frontend

- Code splitting with React Router lazy loading
- Image optimization with responsive images
- Memoization for expensive components
- Virtual scrolling for large lists
- API response caching with React Query

### Backend

- Database query optimization with indexes
- Eager loading relationships (N+1 prevention)
- Redis caching for frequently accessed data
- Queue jobs for heavy processing
- Pagination for large result sets

## SEO Implementation

### Meta Tags

```typescript
// Use react-helmet-async for dynamic meta tags
<Helmet>
  <title>Fresh Flowers - FlowerShop</title>
  <meta name="description" content="Order fresh flowers online" />
  <meta property="og:image" content={heroImage} />
</Helmet>
```

### Structured Data

```typescript
// Implement JSON-LD schema
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Rose Flowers",
  "price": "499.00"
}
</script>
```

## Code Standards

### Frontend

- Functional components only
- React hooks for state management
- TypeScript strict mode
- Descriptive variable names
- Comments for complex logic

### Backend

- Express.js best practices
- Repository pattern for data access
- Service layer for business logic
- Full TypeScript typing
- JSDoc comments

## Coding Example - Feature Implementation

### Feature: Add Product to Cart (Frontend to Backend)

#### 1. Frontend - Type Definition

```typescript
// types/product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}
```

#### 2. Frontend - API Call

```typescript
// api/cart.ts
export async function addToCart(item: CartItem) {
  return apiClient.post("/cart/items", item);
}
```

#### 3. Frontend - React Query Hook

```typescript
// hooks/mutations/useAddToCart.ts
export function useAddToCart() {
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart!");
    },
  });
}
```

#### 4. Frontend - Component

```typescript
// components/ProductCard.tsx
export function ProductCard({ product }: Props) {
  const { mutate: addToCart } = useAddToCart();

  const handleAddToCart = () => {
    addToCart({ productId: product.id, quantity: 1 });
  };

  return (
    <Card>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </Card>
  );
}
```

#### 5. Backend - Request Validation

```php
// Http/Requests/AddToCartRequest.php
class AddToCartRequest extends FormRequest
{
    public function rules()
    {
        return [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:100',
        ];
    }
}
```

#### 6. Backend - Controller

```php
// Http/Controllers/CartController.php
class CartController extends Controller
{
    public function __construct(private CartService $cartService) {}

    public function addItem(AddToCartRequest $request)
    {
        $item = $this->cartService->addItem(
            auth()->id(),
            $request->product_id,
            $request->quantity
        );

        return response()->json(['item' => new CartItemResource($item)], 201);
    }
}
```

#### 7. Backend - Service Layer

```php
// Services/CartService.php
class CartService
{
    public function __construct(private CartRepository $cartRepository) {}

    public function addItem($userId, $productId, $quantity)
    {
        // Validate product exists and is in stock
        $product = Product::findOrFail($productId);
        $this->validateStock($product, $quantity);

        // Get or create cart
        $cart = $this->cartRepository->getOrCreateByUserId($userId);

        // Add or update item
        return $this->cartRepository->addOrUpdateItem($cart->id, $productId, $quantity);
    }
}
```

#### 8. Backend - Repository

```php
// Repositories/CartRepository.php
class CartRepository implements CartRepositoryContract
{
    public function getOrCreateByUserId($userId)
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    public function addOrUpdateItem($cartId, $productId, $quantity)
    {
        return CartItem::updateOrCreate(
            ['cart_id' => $cartId, 'product_id' => $productId],
            ['quantity' => $quantity]
        );
    }
}
```

## Next Steps

1. ✅ Initialize frontend projects with Vite + React
2. ✅ Setup Node.js/Express backend with TypeScript
3. ✅ Implement JWT authentication
4. ✅ Create product listing and details APIs
5. ✅ Build shopping cart functionality
6. ⏳ Integrate Razorpay payment gateway
7. ✅ Develop admin dashboard structure
8. ⏳ Add multi-language support (i18n)
9. ⏳ Implement subscription system
10. ⏳ Setup E2E testing with Playwright
11. ⏳ Setup MySQL database
12. ⏳ Deploy to staging
13. ⏳ Deploy to production

## References

- [React.js Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Sequelize Documentation](https://sequelize.org/)
- [Tailwind CSS](https://tailwindcss.com)
- [Razorpay API](https://razorpay.com/docs)
- [React Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Last Updated**: May 2026  
**Version**: 1.0.0
