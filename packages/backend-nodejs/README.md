# FlowerShop Node.js Backend

A modern, scalable REST API backend for the FlowerShop eCommerce platform built with Express.js, TypeScript, and Sequelize ORM.

## Overview

This is the Node.js/Express migration of the original Laravel backend, maintaining the same API contracts and database schema but leveraging the performance and flexibility of Node.js.

## Technology Stack

- **Runtime**: Node.js (ES modules)
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **ORM**: Sequelize 6.x
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Logger**: Winston

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middleware/       # Express middleware
├── models/          # Sequelize models
├── routes/          # API route definitions
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Helper functions
├── validators/      # Input validation schemas
├── database/        # Migrations and seeders
└── index.ts         # Application entry point
```

## Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- MySQL 8.0+

### Installation

```bash
cd packages/backend-nodejs

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials
```

### Database Setup (run once)

```bash
# Create all tables
pnpm db:migrate

# Insert sample data (optional)
pnpm db:seed
```

> **Note:** These commands only need to be run once (or when the schema changes). The server does **not** auto-migrate on startup.

## Environment Variables

```env
NODE_ENV=development
PORT=8000

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=flowershop

# JWT
JWT_SECRET=your-secret-key-min-32-chars-change-in-production
JWT_EXPIRY=7d

# Client Configuration
CLIENT_ID=default

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Business Configuration
BUSINESS_OPEN_TIME=06:00
BUSINESS_CLOSE_TIME=22:00
SAME_DAY_DELIVERY_DEADLINE=18:00
```

## Running the Server

### Development

```bash
pnpm dev
```

Server runs on `http://localhost:8000` — API at `http://localhost:8000/api`

### Production

```bash
pnpm build
pnpm start
```

### All Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server (no auto-migration) |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Start compiled server |
| `pnpm db:migrate` | Create / update database tables |
| `pnpm db:seed` | Insert sample data |
| `pnpm db:reset` | Drop and recreate all tables |

## API Routes

### Authentication
```
POST   /api/auth/register           # User registration
POST   /api/auth/login              # User login
POST   /api/auth/refresh            # Refresh token
GET    /api/auth/me                 # Get current user
```

### Products
```
GET    /api/products                # List products with filters
GET    /api/products/:id            # Get product details
GET    /api/products/featured       # Get festival specials
GET    /api/products/trending       # Get trending products
POST   /api/products/search         # Search products
GET    /api/products/:id/related    # Get related products
```

### Cart
```
GET    /api/cart                    # Get cart
POST   /api/cart/items              # Add to cart
PATCH  /api/cart/items/:id          # Update cart item
DELETE /api/cart/items/:id          # Remove from cart
DELETE /api/cart                    # Clear cart
```

### Orders
```
GET    /api/orders                  # Get user orders
POST   /api/orders                  # Create order
GET    /api/orders/:id              # Get order details
PATCH  /api/orders/:id              # Update order
GET    /api/orders/:id/tracking     # Get tracking info
GET    /api/orders/:id/invoice      # Download invoice
```

### Payments
```
POST   /api/payments/razorpay       # Create Razorpay order
POST   /api/payments/verify         # Verify payment
GET    /api/payments/:id            # Get payment details
POST   /api/payments/:id/refund     # Request refund
```

### User Profile
```
GET    /api/user/profile            # Get profile
PATCH  /api/user/profile            # Update profile
GET    /api/user/addresses          # Get addresses
POST   /api/user/addresses          # Add address
PATCH  /api/user/addresses/:id      # Update address
DELETE /api/user/addresses/:id      # Delete address
GET    /api/user/wishlist           # Get wishlist
POST   /api/user/wishlist/:id       # Add to wishlist
DELETE /api/user/wishlist/:id       # Remove from wishlist
```

### Subscriptions
```
GET    /api/subscriptions           # List plans
GET    /api/subscriptions/:id       # Get plan
POST   /api/subscriptions           # Create subscription
GET    /api/user/subscriptions      # Get user subscriptions
PATCH  /api/subscriptions/:id       # Update subscription
DELETE /api/subscriptions/:id       # Cancel subscription
```

### Blogs
```
GET    /api/blogs                   # List blogs
GET    /api/blogs/:slug             # Get blog
GET    /api/blogs/category/:slug    # Get category blogs
POST   /api/blogs/:id/reviews       # Add comment
```

### Admin
```
GET    /api/admin/dashboard         # Dashboard stats
GET    /api/admin/orders            # All orders
PATCH  /api/admin/orders/:id        # Update order
GET    /api/admin/analytics         # Analytics
POST   /api/admin/coupons           # Create coupon
POST   /api/admin/delivery-slots    # Manage slots
```

## Database Models

### Core Models
- **User**: Customer and admin accounts with JWT auth
- **Category**: Hierarchical product categories
- **Product**: Catalog with pricing, stock, Tamil descriptions
- **ProductImage**: Product image gallery
- **Cart / CartItem**: Shopping cart with price snapshots
- **Order / OrderItem**: Customer orders with status tracking
- **Payment**: Razorpay payment transactions
- **Address**: Saved delivery addresses

### Feature Models
- **Subscription / SubscriptionDelivery**: Recurring flower delivery plans
- **Blog**: Bilingual (EN/TA) blog posts with SEO fields
- **Review**: Verified product reviews with ratings
- **Coupon**: Fixed and percentage discount coupons

### Seed Data
After running `pnpm db:seed`:
- Admin: `admin@flowershop.com` / `Admin@12345`
- Customer: `customer@flowershop.com` / `Customer@12345`
- 5 categories, 8 South Indian flower/pooja products
- Coupons: `WELCOME10` (10% off), `PONGAL25` (25% off)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login**: Get JWT token from `/api/auth/register` or `/api/auth/login`
2. **Token Usage**: Include in request header: `Authorization: Bearer <token>`
3. **Token Refresh**: Use `/api/auth/refresh` to get a new token
4. **Token Expiry**: Configured via `JWT_EXPIRY` env variable (default: 7 days)

## Multi-Tenancy

All endpoints are scoped to tenants via `CLIENT_ID`:
- `tenantId` is stored on every row (e.g., `default`)
- All queries automatically filtered by tenant
- Supports multiple independent flower shop clients

## Services Layer

Business logic is organized in services:

- **AuthService**: Authentication and token management
- **ProductService**: Product queries, search, recommendations
- **CartService**: Shopping cart operations
- **OrderService**: Order creation and management (To be implemented)
- **PaymentService**: Payment processing (To be implemented)
- **SubscriptionService**: Subscription management (To be implemented)

## Middleware

- **authenticate**: JWT token verification
- **authorize**: Role-based access control
- **errorHandler**: Global error handling
- **requestLogger**: Request/response logging
- **cors**: Cross-origin resource sharing

## Validation

Input validation using Zod schemas:
```typescript
// Example validation
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().regex(/^[0-9]{10}$/),
});
```

## Error Handling

Consistent error responses:
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

Error types:
- `AppError`: Generic application error
- `ValidationError`: Input validation error (400)
- `NotFoundError`: Resource not found (404)
- `UnauthorizedError`: Authentication required (401)
- `ForbiddenError`: Insufficient permissions (403)
- `ConflictError`: Resource conflict (409)

## Testing

```bash
# Run tests
npm test

# Watch mode
npm test:watch

# Coverage
npm test -- --coverage
```

## Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## Database

### Migrations

```bash
# Run migrations
npm run db:migrate

# Create migration
npm run db:migrate -- --create tablename

# Rollback
npm run db:migrate -- --undo
```

### Seeders

```bash
# Seed database
npm run db:seed

# Reset database
npm run db:reset
```

## Deployment

### Build

```bash
npm run build

# Output in ./dist directory
```

### Run Production

```bash
NODE_ENV=production npm start

# Or using pm2
pm2 start dist/index.js --name "flowershop-api"
```

### Docker (Optional)

```bash
docker build -t flowershop-api .
docker run -p 8000:8000 --env-file .env flowershop-api
```

## Performance Optimizations

- Database connection pooling
- Query eager loading (N+1 prevention)
- Response compression
- Request logging and monitoring
- Database indexes on frequently queried fields
- Pagination for large result sets

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- SQL injection prevention via ORM
- XSS protection

## Monitoring

Using Winston for logging:
- Combined logs: `logs/combined.log`
- Error logs: `logs/error.log`
- Console output in development

## Common Issues

### Database Connection Error
```bash
# Ensure MySQL is running and credentials are correct in .env
mysql -h localhost -u root -p -e "CREATE DATABASE flowershop_default_public;"
```

### Port Already in Use
```bash
# Change PORT in .env or kill existing process
lsof -i :8000
kill -9 <PID>
```

### Module Resolution
Ensure you're running with Node 18+ and ES modules are enabled in package.json:
```json
{
  "type": "module"
}
```

## Future Enhancements

- [ ] Complete Order Service implementation
- [ ] Payment gateway integration (Razorpay)
- [ ] Email/SMS notifications
- [ ] Queue jobs for async processing
- [ ] Real-time notifications (WebSocket)
- [ ] Admin analytics dashboard
- [ ] Advanced search and filtering
- [ ] Image upload and optimization
- [ ] Integration tests
- [ ] API rate limiting

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Documentation

- [Architecture](../../CLAUDE.md)
- [Installation Guide](../../INSTALLATION_GUIDE.md)
- [API Documentation](./API_DOCS.md) (To be created)

## License

MIT

## Support

For issues or questions, please open an issue or contact the team.

---

**Version**: 1.0.0  
**Node.js Version**: 18+  
**Last Updated**: May 2026
