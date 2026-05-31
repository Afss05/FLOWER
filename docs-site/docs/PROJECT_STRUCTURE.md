# FlowerShop - Complete Project Structure

```
FlowerShop/
│
├── 📄 CLAUDE.md                                    # Main development guide (7000+ lines)
├── 📄 README.md                                    # Project overview & quick start
├── 📄 CONTRIBUTING.md                              # Contribution guidelines
├── 📄 SETUP.md                                     # Setup & getting started
├── 📄 .env.example                                 # Root environment template
├── 📄 .gitignore                                   # Git ignore rules
├── 📦 package.json                                 # Root workspace package
├── 📦 pnpm-workspace.yaml                          # pnpm monorepo configuration
│
├── 📂 packages/                                    # Monorepo workspaces
│   │
│   ├── 📂 customer-portal/                         # Customer React App (Port 5173)
│   │   ├── 📄 README.md                            # Portal documentation
│   │   ├── 📄 package.json                         # Dependencies
│   │   ├── 📄 vite.config.ts                       # Vite configuration
│   │   ├── 📄 tsconfig.json                        # TypeScript config
│   │   ├── 📄 tsconfig.node.json                   # TS Node config
│   │   ├── 📄 vitest.config.ts                     # Test configuration
│   │   ├── 📄 .eslintrc.js                         # ESLint config
│   │   ├── 📄 tailwind.config.js                   # Tailwind config
│   │   ├── 📄 postcss.config.js                    # PostCSS config
│   │   │
│   │   ├── 📂 src/
│   │   │   ├── 📄 main.tsx                         # Entry point
│   │   │   ├── 📄 App.tsx                          # Root component
│   │   │   ├── 📄 index.css                        # Global styles
│   │   │   │
│   │   │   ├── 📂 api/
│   │   │   │   ├── 📄 client.ts                    # Axios instance
│   │   │   │   ├── 📄 auth.ts                      # Auth endpoints
│   │   │   │   ├── 📄 products.ts                  # Product endpoints
│   │   │   │   ├── 📄 cart.ts                      # Cart endpoints
│   │   │   │   ├── 📄 orders.ts                    # Order endpoints
│   │   │   │   ├── 📄 payments.ts                  # Payment endpoints
│   │   │   │   ├── 📄 subscriptions.ts             # Subscription endpoints
│   │   │   │   └── 📄 blogs.ts                     # Blog endpoints
│   │   │   │
│   │   │   ├── 📂 components/
│   │   │   │   ├── 📂 common/                      # Reusable components
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Navigation.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   └── Loader.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 product/                    # Product components
│   │   │   │   │   ├── ProductCard.tsx
│   │   │   │   │   ├── ProductGallery.tsx
│   │   │   │   │   ├── ProductGrid.tsx
│   │   │   │   │   ├── ProductFilter.tsx
│   │   │   │   │   └── RelatedProducts.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 cart/                       # Cart components
│   │   │   │   │   ├── CartItem.tsx
│   │   │   │   │   ├── CartSummary.tsx
│   │   │   │   │   └── EmptyCart.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 checkout/                   # Checkout components
│   │   │   │   │   ├── AddressForm.tsx
│   │   │   │   │   ├── DeliverySlots.tsx
│   │   │   │   │   ├── PaymentMethod.tsx
│   │   │   │   │   ├── OrderReview.tsx
│   │   │   │   │   └── RazorpayButton.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 auth/                       # Auth components
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── RegisterForm.tsx
│   │   │   │   │   ├── OTPVerification.tsx
│   │   │   │   │   └── ForgotPassword.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 home/                       # Home components
│   │   │   │   │   ├── HeroSlider.tsx
│   │   │   │   │   ├── FeaturedCategories.tsx
│   │   │   │   │   ├── TrendingProducts.tsx
│   │   │   │   │   ├── FestivalSpecials.tsx
│   │   │   │   │   ├── SubscriptionPlans.tsx
│   │   │   │   │   └── BlogSection.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 forms/                      # Form components
│   │   │   │   │   ├── SubscriptionForm.tsx
│   │   │   │   │   ├── ReviewForm.tsx
│   │   │   │   │   └── NewsletterForm.tsx
│   │   │   │   │
│   │   │   │   └── 📂 layout/
│   │   │   │       ├── MainLayout.tsx
│   │   │   │       ├── AuthLayout.tsx
│   │   │   │       └── LanguageSwitch.tsx
│   │   │   │
│   │   │   ├── 📂 pages/                          # Page components
│   │   │   │   ├── 📂 home/
│   │   │   │   │   └── HomePage.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 auth/
│   │   │   │   │   ├── LoginPage.tsx
│   │   │   │   │   ├── RegisterPage.tsx
│   │   │   │   │   ├── OTPPage.tsx
│   │   │   │   │   └── ForgotPasswordPage.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 products/
│   │   │   │   │   ├── ProductListingPage.tsx
│   │   │   │   │   └── ProductDetailsPage.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 cart/
│   │   │   │   │   └── CartPage.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 checkout/
│   │   │   │   │   └── CheckoutPage.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 payment/
│   │   │   │   │   └── PaymentPage.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 profile/
│   │   │   │   │   ├── ProfilePage.tsx
│   │   │   │   │   ├── AddressesPage.tsx
│   │   │   │   │   └── SettingsPage.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 orders/
│   │   │   │   │   ├── OrdersPage.tsx
│   │   │   │   │   ├── OrderDetailsPage.tsx
│   │   │   │   │   └── OrderTrackingPage.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 subscriptions/
│   │   │   │   │   ├── SubscriptionsPage.tsx
│   │   │   │   │   └── SubscriptionDetailsPage.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 wishlist/
│   │   │   │   │   └── WishlistPage.tsx
│   │   │   │   │
│   │   │   │   ├── 📂 blogs/
│   │   │   │   │   ├── BlogListPage.tsx
│   │   │   │   │   └── BlogDetailPage.tsx
│   │   │   │   │
│   │   │   │   └── 📂 not-found/
│   │   │   │       └── NotFoundPage.tsx
│   │   │   │
│   │   │   ├── 📂 hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   │
│   │   │   │   ├── 📂 queries/
│   │   │   │   │   ├── useProducts.ts
│   │   │   │   │   ├── useCategories.ts
│   │   │   │   │   ├── useOrders.ts
│   │   │   │   │   ├── useCart.ts
│   │   │   │   │   └── useUser.ts
│   │   │   │   │
│   │   │   │   └── 📂 mutations/
│   │   │   │       ├── useCreateOrder.ts
│   │   │   │       ├── useAddToCart.ts
│   │   │   │       ├── useUpdateProfile.ts
│   │   │   │       └── useCreateSubscription.ts
│   │   │   │
│   │   │   ├── 📂 store/
│   │   │   │   ├── authStore.ts
│   │   │   │   ├── cartStore.ts
│   │   │   │   ├── filterStore.ts
│   │   │   │   ├── uiStore.ts
│   │   │   │   └── notificationStore.ts
│   │   │   │
│   │   │   ├── 📂 types/
│   │   │   │   ├── index.ts
│   │   │   │   ├── product.ts
│   │   │   │   ├── order.ts
│   │   │   │   ├── user.ts
│   │   │   │   ├── payment.ts
│   │   │   │   ├── api.ts
│   │   │   │   └── forms.ts
│   │   │   │
│   │   │   ├── 📂 utils/
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── validators.ts
│   │   │   │   ├── helpers.ts
│   │   │   │   ├── constants.ts
│   │   │   │   ├── themes.ts
│   │   │   │   └── i18n.ts
│   │   │   │
│   │   │   ├── 📂 validations/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── product.ts
│   │   │   │   ├── checkout.ts
│   │   │   │   ├── address.ts
│   │   │   │   └── payment.ts
│   │   │   │
│   │   │   ├── 📂 constants/
│   │   │   │   ├── api.ts
│   │   │   │   ├── festivals.ts
│   │   │   │   ├── deliverySlots.ts
│   │   │   │   ├── messages.ts
│   │   │   │   └── routes.ts
│   │   │   │
│   │   │   ├── 📂 config/
│   │   │   │   ├── queryClient.ts
│   │   │   │   └── axiosConfig.ts
│   │   │   │
│   │   │   ├── 📂 assets/
│   │   │   │   ├── 📂 images/
│   │   │   │   ├── 📂 icons/
│   │   │   │   └── 📂 fonts/
│   │   │   │
│   │   │   └── 📂 layouts/
│   │   │       ├── RootLayout.tsx
│   │   │       ├── DashboardLayout.tsx
│   │   │       └── CheckoutLayout.tsx
│   │   │
│   │   ├── 📂 public/
│   │   │   ├── favicon.ico
│   │   │   └── assets/
│   │   │
│   │   └── 📂 tests/                              # Unit & component tests
│   │       ├── components/
│   │       ├── hooks/
│   │       └── utils/
│   │
│   ├── 📂 admin-dashboard/                         # Admin React App (Port 5174)
│   │   ├── 📄 README.md
│   │   ├── 📄 package.json
│   │   ├── 📄 vite.config.ts
│   │   ├── 📄 tsconfig.json
│   │   ├── 📄 tsconfig.node.json
│   │   │
│   │   ├── 📂 src/
│   │   │   ├── 📄 main.tsx
│   │   │   ├── 📄 App.tsx
│   │   │   │
│   │   │   ├── 📂 api/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── products.ts
│   │   │   │   ├── categories.ts
│   │   │   │   ├── orders.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── coupons.ts
│   │   │   │   ├── blogs.ts
│   │   │   │   ├── subscriptions.ts
│   │   │   │   └── analytics.ts
│   │   │   │
│   │   │   ├── 📂 components/
│   │   │   │   ├── 📂 common/
│   │   │   │   ├── 📂 forms/
│   │   │   │   ├── 📂 dashboard/
│   │   │   │   ├── 📂 tables/
│   │   │   │   └── 📂 layout/
│   │   │   │
│   │   │   ├── 📂 pages/
│   │   │   │   ├── 📂 dashboard/
│   │   │   │   ├── 📂 products/
│   │   │   │   ├── 📂 categories/
│   │   │   │   ├── 📂 orders/
│   │   │   │   ├── 📂 users/
│   │   │   │   ├── 📂 coupons/
│   │   │   │   ├── 📂 blogs/
│   │   │   │   ├── 📂 subscriptions/
│   │   │   │   ├── 📂 analytics/
│   │   │   │   └── 📂 settings/
│   │   │   │
│   │   │   ├── 📂 hooks/
│   │   │   ├── 📂 store/
│   │   │   ├── 📂 types/
│   │   │   └── 📂 utils/
│   │   │
│   │   ├── 📂 public/
│   │   └── 📂 tests/
│   │
│   ├── 📂 backend/                                 # Laravel API (Port 8000)
│   │   ├── 📄 README.md
│   │   ├── 📄 composer.json                        # PHP dependencies
│   │   ├── 📄 composer.lock
│   │   ├── 📄 .env.example                         # Backend environment
│   │   ├── 📄 artisan                              # Artisan CLI
│   │   │
│   │   ├── 📂 app/
│   │   │   ├── 📂 Http/
│   │   │   │   ├── 📂 Controllers/
│   │   │   │   │   ├── 📂 Auth/
│   │   │   │   │   ├── 📂 Product/
│   │   │   │   │   ├── 📂 Cart/
│   │   │   │   │   ├── 📂 Order/
│   │   │   │   │   ├── 📂 Payment/
│   │   │   │   │   ├── 📂 User/
│   │   │   │   │   ├── 📂 Subscription/
│   │   │   │   │   ├── 📂 Coupon/
│   │   │   │   │   ├── 📂 Blog/
│   │   │   │   │   └── 📂 Admin/
│   │   │   │   │
│   │   │   │   ├── 📂 Middleware/
│   │   │   │   │   ├── AuthMiddleware.php
│   │   │   │   │   ├── TenantMiddleware.php
│   │   │   │   │   ├── AdminMiddleware.php
│   │   │   │   │   └── RateLimitMiddleware.php
│   │   │   │   │
│   │   │   │   ├── 📂 Requests/
│   │   │   │   │   ├── 📂 Auth/
│   │   │   │   │   ├── 📂 Product/
│   │   │   │   │   └── 📂 Order/
│   │   │   │   │
│   │   │   │   └── 📂 Resources/
│   │   │   │       ├── UserResource.php
│   │   │   │       ├── ProductResource.php
│   │   │   │       ├── OrderResource.php
│   │   │   │       └── ... (more resources)
│   │   │   │
│   │   │   ├── 📂 Models/
│   │   │   │   ├── User.php
│   │   │   │   ├── Product.php
│   │   │   │   ├── Category.php
│   │   │   │   ├── Order.php
│   │   │   │   ├── Cart.php
│   │   │   │   ├── Payment.php
│   │   │   │   ├── Subscription.php
│   │   │   │   ├── Blog.php
│   │   │   │   └── ... (more models)
│   │   │   │
│   │   │   ├── 📂 Repositories/
│   │   │   │   ├── 📂 Contracts/
│   │   │   │   │   ├── ProductRepositoryContract.php
│   │   │   │   │   ├── OrderRepositoryContract.php
│   │   │   │   │   └── ... (contracts)
│   │   │   │   │
│   │   │   │   ├── ProductRepository.php
│   │   │   │   ├── OrderRepository.php
│   │   │   │   ├── CartRepository.php
│   │   │   │   └── ... (implementations)
│   │   │   │
│   │   │   ├── 📂 Services/
│   │   │   │   ├── 📂 Auth/
│   │   │   │   ├── 📂 Product/
│   │   │   │   ├── 📂 Order/
│   │   │   │   ├── 📂 Payment/
│   │   │   │   ├── 📂 Cart/
│   │   │   │   ├── 📂 Subscription/
│   │   │   │   ├── 📂 Notification/
│   │   │   │   ├── 📂 Analytics/
│   │   │   │   └── 📂 Tenant/
│   │   │   │
│   │   │   ├── 📂 Events/
│   │   │   │   ├── OrderCreated.php
│   │   │   │   ├── OrderStatusChanged.php
│   │   │   │   ├── PaymentSuccessful.php
│   │   │   │   └── ... (events)
│   │   │   │
│   │   │   ├── 📂 Jobs/
│   │   │   │   ├── ProcessSubscriptionDelivery.php
│   │   │   │   ├── SendOrderConfirmation.php
│   │   │   │   └── ... (jobs)
│   │   │   │
│   │   │   ├── 📂 Listeners/
│   │   │   │   ├── SendOrderConfirmationEmail.php
│   │   │   │   └── ... (listeners)
│   │   │   │
│   │   │   ├── 📂 Notifications/
│   │   │   │   ├── OrderConfirmation.php
│   │   │   │   └── ... (notifications)
│   │   │   │
│   │   │   ├── 📂 Traits/
│   │   │   │   ├── TenantTrait.php
│   │   │   │   ├── FilterableTrait.php
│   │   │   │   └── ... (traits)
│   │   │   │
│   │   │   ├── 📂 Helpers/
│   │   │   │   ├── ResponseHelper.php
│   │   │   │   └── ... (helpers)
│   │   │   │
│   │   │   ├── 📂 Exceptions/
│   │   │   │   ├── TenantNotFoundException.php
│   │   │   │   └── ... (exceptions)
│   │   │   │
│   │   │   └── 📂 Observers/
│   │   │       ├── ProductObserver.php
│   │   │       └── ... (observers)
│   │   │
│   │   ├── 📂 database/
│   │   │   ├── 📂 migrations/
│   │   │   │   ├── 2024_01_01_000000_create_tenants_table.php
│   │   │   │   ├── 2024_01_01_000001_create_users_table.php
│   │   │   │   └── ... (migrations)
│   │   │   │
│   │   │   ├── 📂 seeders/
│   │   │   │   ├── DatabaseSeeder.php
│   │   │   │   ├── TenantSeeder.php
│   │   │   │   └── ... (seeders)
│   │   │   │
│   │   │   └── 📂 factories/
│   │   │       ├── UserFactory.php
│   │   │       └── ... (factories)
│   │   │
│   │   ├── 📂 routes/
│   │   │   ├── api.php                            # API routes
│   │   │   └── web.php                            # Web routes
│   │   │
│   │   ├── 📂 config/
│   │   │   ├── app.php
│   │   │   ├── database.php
│   │   │   ├── mail.php
│   │   │   ├── queue.php
│   │   │   ├── sanctum.php
│   │   │   ├── services.php
│   │   │   └── ... (configs)
│   │   │
│   │   ├── 📂 storage/
│   │   │   ├── 📂 app/
│   │   │   │   └── 📂 uploads/
│   │   │   │       ├── products/
│   │   │   │       ├── blogs/
│   │   │   │       └── users/
│   │   │   │
│   │   │   ├── 📂 logs/
│   │   │   └── 📂 framework/
│   │   │
│   │   ├── 📂 tests/
│   │   │   ├── 📂 Unit/
│   │   │   │   ├── 📂 Services/
│   │   │   │   ├── 📂 Repositories/
│   │   │   │   └── 📂 Helpers/
│   │   │   │
│   │   │   └── 📂 Feature/
│   │   │       ├── 📂 Auth/
│   │   │       ├── 📂 Product/
│   │   │       ├── 📂 Order/
│   │   │       └── 📂 Payment/
│   │   │
│   │   └── 📂 public/
│   │       └── index.php
│   │
│   └── 📂 config/                                  # Shared Configuration
│       ├── 📄 README.md
│       ├── 📄 package.json
│       ├── 📄 tsconfig.json
│       ├── 📄 index.ts                             # Barrel exports
│       │
│       ├── 📂 clients/
│       │   └── 📂 default/                         # Default client config
│       │       ├── 📄 theme.ts                     # Brand configuration
│       │       ├── 📄 public-config.ts             # Public settings
│       │       ├── 📄 private-config.ts            # Secrets (git-ignored)
│       │       │
│       │       ├── 📂 pages/
│       │       │   ├── home.ts
│       │       │   ├── products.ts
│       │       │   └── ... (page configs)
│       │       │
│       │       └── 📂 workflows/
│       │           ├── order-workflow.ts
│       │           └── ... (workflows)
│       │
│       └── 📂 schema/
│           ├── 📄 theme.ts                        # Type definitions
│           ├── 📄 pages.ts
│           └── 📄 workflows.ts
│
├── 📂 docs-site/                                   # Documentation Website
│   ├── 📄 README.md
│   ├── 📄 package.json
│   ├── 📄 docusaurus.config.ts
│   ├── 📄 sidebars.ts
│   ├── 📄 tsconfig.json
│   │
│   ├── 📂 docs/
│   │   ├── 📂 getting-started/
│   │   ├── 📂 architecture/
│   │   ├── 📂 api/
│   │   ├── 📂 frontend/
│   │   ├── 📂 backend/
│   │   ├── 📂 database/
│   │   ├── 📂 deployment/
│   │   ├── 📂 testing/
│   │   ├── 📂 multi-tenancy/
│   │   ├── 📂 configuration/
│   │   └── 📂 troubleshooting/
│   │
│   ├── 📂 src/
│   │   ├── css/
│   │   └── components/
│   │
│   ├── 📂 static/
│   │   └── img/
│   │
│   └── 📂 scripts/
│       ├── generate-actions-registry.ts
│       └── generate-all-registries.ts
│
├── 📂 e2e/                                         # End-to-End Tests (Playwright)
│   ├── 📄 README.md
│   ├── 📄 package.json
│   ├── 📄 playwright.config.ts
│   ├── 📄 vitest.config.ts
│   ├── 📄 global-setup.ts
│   │
│   ├── 📂 tests/
│   │   ├── 📂 customer-portal/
│   │   │   ├── 📂 auth/
│   │   │   │   └── login.spec.ts
│   │   │   │
│   │   │   ├── 📂 products/
│   │   │   │   ├── browse.spec.ts
│   │   │   │   └── search.spec.ts
│   │   │   │
│   │   │   ├── 📂 cart/
│   │   │   │   └── checkout.spec.ts
│   │   │   │
│   │   │   ├── 📂 orders/
│   │   │   │   └── tracking.spec.ts
│   │   │   │
│   │   │   └── 📂 subscriptions/
│   │   │       └── management.spec.ts
│   │   │
│   │   └── 📂 admin/
│   │       ├── 📂 auth/
│   │       ├── 📂 products/
│   │       ├── 📂 orders/
│   │       ├── 📂 analytics/
│   │       └── 📂 users/
│   │
│   ├── 📂 helpers/
│   │   ├── auth-helpers.ts
│   │   ├── product-helpers.ts
│   │   └── ... (test helpers)
│   │
│   ├── 📂 shared/
│   │   ├── test-data.ts
│   │   ├── test-accounts.ts
│   │   └── constants.ts
│   │
│   ├── 📂 test-results/                           # Test result artifacts
│   └── 📂 playwright-report/                      # HTML test report
│
└── 📂 scripts/                                     # Utility scripts
    ├── setup.sh                                   # Setup script
    ├── db-init.sh                                 # Database initialization
    └── deploy.sh                                  # Deployment script
```

---

## Directory Statistics

| Category            | Count |
| ------------------- | ----- |
| Total Directories   | 150+  |
| Source Files        | 250+  |
| Configuration Files | 30+   |
| Documentation Files | 20+   |
| Test Files          | 100+  |

## Key Features by Directory

### Customer Portal (`packages/customer-portal/`)

- Product browsing and search
- Shopping cart management
- Checkout & payment
- Order tracking
- User profile
- Wishlist & reviews
- Subscription management
- Blog reading
- Multi-language support

### Admin Dashboard (`packages/admin-dashboard/`)

- Analytics dashboard
- Product management (CRUD)
- Category management
- Order management
- Customer management
- Coupon management
- Blog CMS
- Subscription management
- Revenue analytics

### Backend (`packages/backend/`)

- REST API with 30+ endpoints
- Authentication (Sanctum)
- Multi-tenant architecture
- Payment integration (Razorpay)
- Order processing
- Subscription management
- Email notifications
- Queue jobs
- Event-driven architecture

### Configuration (`packages/config/`)

- Theme customization
- Client-specific settings
- Multi-tenant support
- Business configuration
- Feature flags

### Documentation (`docs-site/`)

- Architecture guides
- API documentation
- Setup instructions
- Development patterns
- Troubleshooting guides

### Testing (`e2e/`)

- Playwright integration tests
- User workflow testing
- Cross-browser testing
- CI/CD integration

---

**Note**: This is a complete scaffold. Actual implementation files will be created as features are developed. Start with the SETUP.md and CLAUDE.md guides.
