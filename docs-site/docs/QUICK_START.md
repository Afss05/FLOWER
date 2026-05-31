# Quick Start Guide: FlowerShop with Node.js Backend

Get the FlowerShop project running locally with the new Node.js backend in minutes!

## Prerequisites

- Node.js 18+
- npm or pnpm
- MySQL 8.0+
- Git

## Installation (5 minutes)

### 1. Clone & Install Dependencies

```bash
# Navigate to project root
cd FlowerShop

# Install all dependencies (frontend + backend)
pnpm install
# or
npm install
```

### 2. Setup Backend

```bash
# Navigate to backend
cd packages/backend-nodejs

# Copy environment file
cp .env.example .env

# Edit .env with your MySQL credentials
# nano .env
```

### 3. Setup Frontend (if not already done)

```bash
cd packages/customer-portal
cp .env.example .env
# .env already has correct API_URL pointing to localhost:8000
```

### 4. Initialize Database

```bash
# From project root or backend-nodejs directory
# Make sure MySQL is running
mysql -u root -e "CREATE DATABASE IF NOT EXISTS flowershop_default_public;"

# Run from backend-nodejs
npm run db:migrate
# npm run db:seed  # Optional: seed sample data
```

## Running the Project

### Terminal 1: Start Backend (API Server)

```bash
cd packages/backend-nodejs
npm run dev

# Expected output:
# ✓ Database connected and synchronized
# ✓ Server running on port 8000
# ✓ API Base URL: http://localhost:8000/api
```

### Terminal 2: Start Customer Portal

```bash
cd packages/customer-portal
npm run dev

# Expected output:
# VITE v5.x.x  ready in XXX ms
# ➜  Local: http://localhost:5173/
```

### Terminal 3 (Optional): Start Admin Dashboard

```bash
cd packages/admin-dashboard
npm run dev

# Admin will run on http://localhost:5174/
```

## Verify Installation

### 1. Check Backend Health

```bash
curl http://localhost:8000/health

# Expected response:
# {"status":"ok","timestamp":"2026-05-28T..."}
```

### 2. Test Registration

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "9876543210"
  }'

# Expected response:
# {
#   "success": true,
#   "message": "Registration successful",
#   "data": {
#     "user": { ... },
#     "token": "eyJ..."
#   }
# }
```

### 3. Test Products API

```bash
curl http://localhost:8000/api/products \
  -H "Accept: application/json"

# Expected response:
# {
#   "success": true,
#   "message": "Products retrieved successfully",
#   "data": {
#     "data": [...],
#     "total": 0,
#     "page": 1,
#     "limit": 15,
#     "totalPages": 0
#   }
# }
```

## Project Structure

```
FlowerShop/
├── packages/
│   ├── backend-nodejs/         # NEW: Node.js/Express API
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   ├── customer-portal/        # React customer app
│   │   ├── src/
│   │   └── package.json
│   ├── admin-dashboard/        # React admin app
│   │   ├── src/
│   │   └── package.json
│   ├── config/                 # Shared client configs
│   │   └── package.json
│   └── backend/                # OLD: Laravel backend (deprecated)
├── e2e/                        # End-to-end tests
├── docs-site/                  # Documentation site
├── pnpm-workspace.yaml
├── package.json
└── NODEJS_MIGRATION.md         # Migration guide
```

## Common Tasks

### Add Sample Data

```bash
cd packages/backend-nodejs
npm run db:seed
```

### Check Database

```bash
mysql -u root flowershop_default_public -e "SELECT * FROM users;"
```

### View Logs

```bash
# Backend logs appear in terminal output
# Also stored in:
tail -f packages/backend-nodejs/logs/combined.log
```

### Reset Database

```bash
cd packages/backend-nodejs
npm run db:reset  # Drops and recreates all tables
```

### Test an Endpoint

```bash
# Get user token first
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' | jq -r '.data.token')

# Use token in authenticated request
curl http://localhost:8000/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

## API Documentation

### Authentication

```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "phone": "9876543210"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Get Current User (requires token)
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Products

```bash
# List Products
GET /api/products?page=1&limit=15

# Get Product Details
GET /api/products/1

# Search Products
POST /api/products/search?q=roses

# Featured/Festival Products
GET /api/products/featured

# Trending Products
GET /api/products/trending
```

### Cart (Requires Authentication)

```bash
# Get Cart
GET /api/cart
Headers: Authorization: Bearer <token>

# Add to Cart
POST /api/cart/items
Headers: Authorization: Bearer <token>
{
  "productId": 1,
  "quantity": 2
}

# Update Cart Item
PATCH /api/cart/items/1
{
  "quantity": 3
}

# Remove from Cart
DELETE /api/cart/items/1

# Clear Cart
DELETE /api/cart
```

## Environment Variables

### Backend (.env)

```env
# Required
NODE_ENV=development
PORT=8000
DB_HOST=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=flowershop_default_public

# Security
JWT_SECRET=your-secret-key
CLIENT_ID=default

# Optional
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=FlowerShop
```

## Troubleshooting

### Port 8000 Already in Use

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8000
kill -9 <PID>
```

### Database Connection Error

```bash
# Check MySQL is running
mysql -u root -p

# Create database if missing
mysql -u root -e "CREATE DATABASE flowershop_default_public;"

# Update .env with correct credentials
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install

# Clear TypeScript cache
rm -rf dist
npm run build
```

### API Returns 401 Unauthorized

```bash
# Make sure token is included in headers
# Authorization: Bearer <token>

# Token might be expired, login again
```

### CORS Errors

```bash
# Update CORS_ORIGIN in backend .env
# Make sure frontend URL is in the list
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

## Development Tips

1. **Use TypeScript**: Types are enforced - use them for IDE autocomplete
2. **Check Models**: Database models are in `src/models/`
3. **Services Logic**: Business logic is in `src/services/`
4. **Validation**: Input validation schemas in `src/validators/`
5. **API Routes**: Routes organized by resource in `src/routes/`
6. **Error Handling**: Always throw `AppError` subclasses

## Next Steps

1. **Read Full Documentation**: [NODEJS_MIGRATION.md](./NODEJS_MIGRATION.md)
2. **Backend README**: [packages/backend-nodejs/README.md](./packages/backend-nodejs/README.md)
3. **Implementation**: Start implementing remaining services
4. **Testing**: Write tests for your features
5. **Deployment**: Follow deployment guide

## File Structure by Feature

```
Feature: Product Management

# Model
packages/backend-nodejs/src/models/Product.ts

# Service (Business Logic)
packages/backend-nodejs/src/services/ProductService.ts

# Controller (Request Handler)
packages/backend-nodejs/src/controllers/ProductController.ts

# Routes (Endpoints)
packages/backend-nodejs/src/routes/products.ts

# Validation
packages/backend-nodejs/src/validators/index.ts (productSchema)

# Tests
packages/backend-nodejs/tests/services/ProductService.test.ts
```

## Useful Commands

```bash
# Install specific package
pnpm add package-name

# Run script in specific package
pnpm --filter @flowershop/backend-nodejs add express

# Update all dependencies
pnpm update

# Check for outdated packages
pnpm outdated

# Clean and reinstall
pnpm clean && pnpm install
```

## Support & Resources

- **Backend README**: `packages/backend-nodejs/README.md`
- **Migration Guide**: `NODEJS_MIGRATION.md`
- **Main Documentation**: `CLAUDE.md`
- **Installation Guide**: `INSTALLATION_GUIDE.md`

## Quick Reference Card

```
# All terminals needed:
Terminal 1: cd packages/backend-nodejs && npm run dev
Terminal 2: cd packages/customer-portal && npm run dev
Terminal 3: cd packages/admin-dashboard && npm run dev

# URLs:
Backend API:  http://localhost:8000
Customer App: http://localhost:5173
Admin App:    http://localhost:5174
Docs:         http://localhost:5174/docs (if available)

# Test user (after seeding):
Email: test@example.com
Pass: password123
```

---

**Last Updated**: May 2026  
**Version**: 1.0.0  
**Stack**: Node.js + React + MySQL
