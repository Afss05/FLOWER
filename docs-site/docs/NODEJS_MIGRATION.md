# FlowerShop: Laravel to Node.js Migration Guide

## Project Migration Overview

This document outlines the complete migration of FlowerShop backend from **Laravel 11 PHP** to **Node.js/Express.js with TypeScript**.

## Migration Status

### ✅ Completed
- [x] Express.js project setup with TypeScript
- [x] Database models using Sequelize ORM
- [x] Authentication system with JWT
- [x] Core models: User, Product, Category, Cart, Order, Payment, etc.
- [x] Validation schemas using Zod
- [x] Error handling middleware
- [x] Request logging with Winston
- [x] Core services: AuthService, ProductService, CartService
- [x] Basic controllers: AuthController, ProductController, CartController
- [x] API routes scaffolding for all endpoints
- [x] Multi-tenancy configuration
- [x] Environment setup and configuration

### 🔄 In Progress / To Do
- [ ] Complete OrderService implementation
- [ ] Complete PaymentService with Razorpay integration
- [ ] Complete SubscriptionService
- [ ] UserService with address and profile management
- [ ] BlogService
- [ ] Admin analytics and reporting
- [ ] All remaining controllers
- [ ] Comprehensive test suite
- [ ] Database migrations script
- [ ] Seed data generation
- [ ] File upload handling
- [ ] Email notifications
- [ ] Queue job processing
- [ ] Performance optimization and caching
- [ ] API documentation generation

## Directory Structure Comparison

### Laravel (Old)
```
packages/backend/
├── app/
│   ├── Http/Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Repositories/
│   ├── Listeners/
│   └── Exceptions/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── tests/
```

### Node.js (New)
```
packages/backend-nodejs/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   ├── validators/
│   ├── types/
│   ├── utils/
│   ├── config/
│   └── database/
├── tests/
├── dist/
└── tsconfig.json
```

## Key Differences

### 1. Package Management
**Laravel**: `composer.json`, PHP dependencies
**Node.js**: `package.json`, npm/pnpm dependencies

### 2. Language
**Laravel**: PHP 8.3
**Node.js**: TypeScript 5.x (transpiled to JavaScript)

### 3. Routing
**Laravel**: `routes/api.php` with fluent API
**Node.js**: Express Router in separate files per resource

### 4. Database ORM
**Laravel**: Eloquent ORM
**Node.js**: Sequelize ORM

### 5. Authentication
**Laravel**: Laravel Sanctum
**Node.js**: JWT (jsonwebtoken)

### 6. Validation
**Laravel**: Laravel Validation Rules
**Node.js**: Zod Schema Validation

### 7. Model Definitions
**Laravel**: PHP class with properties and methods
**Node.js**: Sequelize model with DataTypes

## Implementation Guide

### Phase 1: Project Setup (✅ Complete)
1. Initialize Node.js/Express project
2. Configure TypeScript
3. Setup Sequelize ORM
4. Create project structure
5. Setup environment configuration

### Phase 2: Core Models (✅ Complete)
Sequelize models created for:
- User
- Product
- Category
- ProductImage
- Cart
- CartItem
- Order
- OrderItem
- Payment
- Address
- Subscription
- SubscriptionDelivery
- Blog
- Review
- Coupon

### Phase 3: Services Layer (🔄 In Progress)
Services implemented:
- ✅ AuthService
- ✅ ProductService
- ✅ CartService
- 🔄 OrderService (Partial)
- 🔄 PaymentService (Placeholder)
- 🔄 SubscriptionService (Placeholder)
- 🔄 UserService (Placeholder)
- 🔄 BlogService (Placeholder)

### Phase 4: Controllers & Routes (🔄 In Progress)
Controllers implemented:
- ✅ AuthController
- ✅ ProductController
- ✅ CartController
- 🔄 OrderController (Placeholder)
- 🔄 PaymentController (Placeholder)
- 🔄 Others (Placeholders)

### Phase 5: Middleware (✅ Complete)
- ✅ authenticate.ts - JWT verification
- ✅ errorHandler.ts - Global error handling
- ✅ requestLogger.ts - Request logging

### Phase 6: Validation (✅ Complete)
- ✅ Zod schemas for all input types

### Phase 7: Testing (📋 Todo)
- Unit tests for services
- Controller/route tests
- Integration tests
- E2E tests

## Migration Steps for Existing Features

### 1. Authentication Flow

**Laravel Implementation**:
```php
// Laravel Controller
public function login(LoginRequest $request) {
    $user = User::where('email', $request->email)->first();
    $token = $user->createToken('auth-token')->plainTextToken;
    return ['user' => $user, 'token' => $token];
}
```

**Node.js Implementation**:
```typescript
// Node.js Service
async login(data: LoginInput, tenantId: string) {
    const user = await User.findOne({
        where: { email: data.email, tenantId },
    });
    const token = this.generateToken(user);
    return { user, token };
}
```

### 2. Query Building

**Laravel**:
```php
Product::where('category_id', $categoryId)
    ->where('price', '<=', $maxPrice)
    ->with('images')
    ->paginate(15);
```

**Node.js**:
```typescript
Product.findAndCountAll({
    where: {
        categoryId,
        price: { [Op.lte]: maxPrice },
    },
    include: [{ model: ProductImage }],
    limit: 15,
    offset: (page - 1) * 15,
});
```

### 3. Model Relationships

**Laravel Relationships**:
```php
// In Product model
public function category() {
    return $this->belongsTo(Category::class);
}

public function images() {
    return $this->hasMany(ProductImage::class);
}
```

**Sequelize Associations** (To be added):
```typescript
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
```

### 4. Validation

**Laravel Validation**:
```php
$validated = $request->validate([
    'email' => 'required|email|unique:users',
    'password' => 'required|min:6',
]);
```

**Zod Validation**:
```typescript
const registerSchema = z.object({
    email: z.string().email().unique(),
    password: z.string().min(6),
});
const validated = registerSchema.parse(req.body);
```

### 5. Response Formatting

**Laravel**:
```php
// API response helper
response()->json([
    'success' => true,
    'data' => $data,
    'message' => 'Success'
]);
```

**Node.js**:
```typescript
// Helper function
sendSuccess(res, data, 'Success', 200);
```

## Database Migration Path

### Setup New Database
```bash
# Create MySQL database
CREATE DATABASE flowershop_default_public;
CREATE DATABASE flowershop_yw_flowers_public;  # For other clients
```

### Run Sequelize Sync
```bash
npm run db:migrate  # Sync models to database
```

### Data Migration (If Needed)
1. Export data from Laravel (PHP script)
2. Transform to Node.js format (if schema differs)
3. Import into MySQL using Sequelize seeders

## API Compatibility

### Same Endpoints
All API endpoints remain the same:
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/products
POST   /api/cart/items
GET    /api/orders
POST   /api/payments/razorpay
... (all other endpoints)
```

### Request/Response Format
Identical request and response structures maintained for frontend compatibility.

## Testing Frontend Integration

1. **Start Node.js Backend**:
   ```bash
   cd packages/backend-nodejs
   npm install
   npm run dev
   ```

2. **Update Frontend API URL** (if needed):
   ```typescript
   // .env or config
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Start Frontend**:
   ```bash
   cd packages/customer-portal
   npm install
   npm run dev
   ```

4. **Test Features**:
   - Registration/Login
   - Product listing
   - Cart operations
   - Order creation
   - etc.

## Performance Comparison

### Advantages of Node.js
- ✅ Non-blocking I/O (better for concurrent requests)
- ✅ Faster startup time
- ✅ TypeScript for type safety
- ✅ Simpler deployment (no PHP-FPM needed)
- ✅ Better real-time capabilities (WebSocket ready)
- ✅ Single language for full-stack JavaScript

### Potential Considerations
- Memory usage might be different
- PHP is more mature for web servers (but Node.js is production-ready)
- Need to test with production load

## Deployment Checklist

- [ ] Complete all services implementation
- [ ] Write comprehensive tests
- [ ] Performance testing and optimization
- [ ] Security audit
- [ ] Database backup strategy
- [ ] Error monitoring setup
- [ ] Logging and analytics
- [ ] Update API documentation
- [ ] Train team on Node.js stack
- [ ] Plan rollback strategy

## File Structure Summary

```
backend-nodejs/
├── src/
│   ├── index.ts                    # Express app entry
│   ├── config/
│   │   └── database.ts            # Sequelize setup
│   ├── middleware/
│   │   ├── authenticate.ts        # JWT auth
│   │   ├── errorHandler.ts        # Error handling
│   │   └── requestLogger.ts       # Logging
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Cart.ts
│   │   ├── Order.ts
│   │   ├── Payment.ts
│   │   └── ... (11+ models)
│   ├── services/
│   │   ├── AuthService.ts         # ✅
│   │   ├── ProductService.ts      # ✅
│   │   ├── CartService.ts         # ✅
│   │   └── ... (more to implement)
│   ├── controllers/
│   │   ├── AuthController.ts      # ✅
│   │   ├── ProductController.ts   # ✅
│   │   ├── CartController.ts      # ✅
│   │   └── ... (more to implement)
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   ├── payments.ts
│   │   ├── users.ts
│   │   ├── subscriptions.ts
│   │   ├── blogs.ts
│   │   └── admin.ts
│   ├── validators/
│   │   └── index.ts               # Zod schemas ✅
│   ├── types/
│   │   └── index.ts               # TypeScript types ✅
│   └── utils/
│       ├── errors.ts              # Error classes ✅
│       └── helpers.ts             # Helper functions ✅
├── tests/
├── package.json                    # ✅
├── tsconfig.json                   # ✅
├── README.md                       # ✅
└── .env.example                    # ✅
```

## Next Steps

1. **Complete Service Implementation**:
   - OrderService (create, retrieve, update, cancel)
   - PaymentService (Razorpay integration)
   - SubscriptionService
   - UserService
   - BlogService
   - AdminService

2. **Add Remaining Controllers**:
   - OrderController
   - PaymentController
   - UserController
   - SubscriptionController
   - BlogController
   - AdminController

3. **Database Features**:
   - Model associations
   - Create migration scripts
   - Setup database seeders
   - Add indexes for performance

4. **Testing**:
   - Unit tests for services
   - Integration tests for routes
   - End-to-end tests with frontend

5. **DevOps**:
   - Docker containerization
   - CI/CD pipeline
   - Deployment automation
   - Monitoring and alerting

## Support & Resources

- [Express.js Documentation](https://expressjs.com)
- [Sequelize Documentation](https://sequelize.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Zod Documentation](https://zod.dev)
- [Project CLAUDE.md](../CLAUDE.md)

---

**Migration Start Date**: May 2026  
**Target Completion**: May 2026  
**Status**: In Progress
