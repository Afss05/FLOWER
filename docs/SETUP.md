# FlowerShop - Setup & Getting Started Guide

## 🎯 Project Created Successfully!

Your FlowerShop eCommerce platform has been scaffolded with a production-ready structure similar to ConnectMe, with multi-tenant support for future scaling.

## 📁 What Was Created

```
FlowerShop/
├── 📄 CLAUDE.md                        # Complete development guide (7000+ lines)
├── 📄 README.md                        # Quick start guide
├── 📄 CONTRIBUTING.md                  # Contribution guidelines
├── 📄 SETUP.md                         # This file
├── 📝 .env.example                     # Environment template
├── 📝 .gitignore                       # Git ignore rules
├── 📦 package.json                     # Root workspace config
├── 📦 pnpm-workspace.yaml              # pnpm monorepo config
│
├── 📂 packages/
│   ├── 📂 customer-portal/             # Customer React app (port 5173)
│   │   ├── src/
│   │   │   ├── api/                   # API client functions
│   │   │   ├── components/            # Reusable components
│   │   │   ├── pages/                 # Page components
│   │   │   ├── hooks/                 # Custom hooks
│   │   │   ├── store/                 # Zustand stores
│   │   │   ├── types/                 # TypeScript types
│   │   │   └── utils/                 # Utilities
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── 📂 admin-dashboard/             # Admin React app (port 5174)
│   │   ├── src/
│   │   │   ├── api/                   # Admin API calls
│   │   │   ├── components/            # Dashboard components
│   │   │   ├── pages/                 # Admin pages
│   │   │   ├── hooks/                 # Admin hooks
│   │   │   ├── store/                 # Admin state
│   │   │   ├── types/                 # Admin types
│   │   │   └── utils/                 # Admin utilities
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── 📂 backend/                     # Laravel API (port 8000)
│   │   ├── app/
│   │   │   ├── Http/Controllers/      # Controllers
│   │   │   ├── Models/                # Eloquent models
│   │   │   ├── Services/              # Business logic
│   │   │   ├── Repositories/          # Data access
│   │   │   ├── Events/                # Events
│   │   │   ├── Jobs/                  # Queue jobs
│   │   │   └── Notifications/         # Email/SMS
│   │   ├── database/
│   │   │   ├── migrations/            # Schema migrations
│   │   │   ├── seeders/               # Data seeders
│   │   │   └── factories/             # Test factories
│   │   ├── routes/
│   │   ├── config/
│   │   ├── storage/
│   │   ├── tests/
│   │   ├── composer.json
│   │   ├── .env.example
│   │   └── README.md
│   │
│   ├── 📂 config/                      # Shared configuration
│   │   ├── clients/
│   │   │   └── default/               # Default client config
│   │   │       └── theme.ts           # Theme configuration
│   │   ├── schema/                    # Type definitions
│   │   ├── package.json
│   │   └── README.md
│
├── 📂 docs-site/                       # Documentation website
│   ├── docs/                          # Markdown documentation
│   └── README.md
│
└── 📂 e2e/                            # End-to-end tests
    ├── tests/                        # Playwright tests
    └── README.md
```

## 🚀 Next Steps

### Phase 1: Initial Setup (30 minutes)

#### 1.1 Install Node.js & Package Managers

```bash
# Verify Node.js 18+
node --version

# Install pnpm globally
npm install -g pnpm

# Verify pnpm
pnpm --version
```

#### 1.2 Install Dependencies

```bash
cd FlowerShop

# Install all workspace dependencies
pnpm install
```

#### 1.3 Setup Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Copy backend template
cp packages/backend/.env.example packages/backend/.env

# Edit .env files with your settings
# Important: Update DATABASE credentials, RAZORPAY keys, etc.
```

### Phase 2: Backend Setup (45 minutes)

#### 2.1 Install PHP & Dependencies

```bash
# Verify PHP 8.3+
php --version

# Verify Composer
composer --version

# Install Composer dependencies
cd packages/backend
composer install

# Generate application key
php artisan key:generate

# Verify setup
php artisan env
```

#### 2.2 Database Setup

```bash
# Create MySQL database
mysql -u root -p
> CREATE DATABASE flowershop_default_public;
> EXIT;

# Run migrations
php artisan migrate

# Seed sample data
php artisan db:seed

# Verify database
php artisan tinker
```

#### 2.3 Start Backend Server

```bash
# Start development server
php artisan serve --port=8000

# Verify API is running
curl http://localhost:8000/api/products
```

### Phase 3: Frontend Setup (30 minutes)

#### 3.1 Start Customer Portal

```bash
# In new terminal from root
pnpm --filter @flowershop/customer-portal dev

# Access at http://localhost:5173
```

#### 3.2 Start Admin Dashboard

```bash
# In new terminal from root
pnpm --filter @flowershop/admin-dashboard dev

# Access at http://localhost:5174
```

## 🎮 Development Commands

### All Services (from root)

```bash
# Start everything
pnpm dev

# This starts all three services:
# - Customer Portal: http://localhost:5173
# - Admin Dashboard: http://localhost:5174
# - Backend API: http://localhost:8000 (manual start in separate terminal)
```

### Individual Services

**Customer Portal**

```bash
cd packages/customer-portal
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm test             # Run tests
pnpm lint             # Check code quality
pnpm type-check       # TypeScript check
```

**Admin Dashboard**

```bash
cd packages/admin-dashboard
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm test             # Run tests
pnpm lint             # Check code quality
pnpm type-check       # TypeScript check
```

**Backend**

```bash
cd packages/backend
php artisan serve --port=8000     # Start dev server
php artisan migrate               # Run migrations
php artisan db:seed               # Seed data
php artisan test                  # Run tests
./vendor/bin/pint                 # Format code
php artisan tinker                # Interactive shell
```

## 📚 Essential Documentation

### Comprehensive Guide

👉 **Read [CLAUDE.md](CLAUDE.md)** - Contains:

- Complete architecture overview
- Database schema design
- All API endpoints
- Frontend & backend patterns
- Multi-tenant setup
- Deployment guide
- Code standards
- Development workflow

### Quick Guides

- [README.md](README.md) - Project overview & quick start
- [packages/customer-portal/README.md](packages/customer-portal/README.md) - Portal guide
- [packages/admin-dashboard/README.md](packages/admin-dashboard/README.md) - Admin guide
- [packages/backend/README.md](packages/backend/README.md) - Backend guide
- [packages/config/README.md](packages/config/README.md) - Config guide
- [e2e/README.md](e2e/README.md) - Testing guide

## 🏗️ Architecture Overview

### Three-Tier Structure

```
┌─────────────────────┐
│  Frontend (React)   │
│  - Customer Portal  │
│  - Admin Dashboard  │
└──────────┬──────────┘
           │ HTTP/API
┌──────────▼──────────┐
│  Backend (Laravel)  │
│  - REST API         │
│  - Authentication   │
│  - Business Logic   │
└──────────┬──────────┘
           │ SQL
┌──────────▼──────────┐
│  Database (MySQL)   │
│  - Schema/Tenant    │
│  - Products, Orders │
│  - Users, Payments  │
└─────────────────────┘
```

### Multi-Tenancy

```
CLIENT_ID=default
├── Database: flowershop_default_public
├── Config: packages/config/clients/default/
└── Supports: Default flower shop

CLIENT_ID=yw-flowers
├── Database: flowershop_yw_flowers_public
├── Config: packages/config/clients/yw-flowers/
└── Supports: Yorkshire Water flowers client
```

## 🔐 First Steps After Setup

### 1. Create Admin User

```bash
cd packages/backend

# Use tinker to create admin
php artisan tinker

# In tinker shell:
User::create([
    'email' => 'admin@flowershop.local',
    'password' => bcrypt('Admin@12345'),
    'name' => 'Admin User',
    'role' => 'admin',
])
```

### 2. Test Authentication

```bash
# POST to login endpoint
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flowershop.local","password":"Admin@12345"}'
```

### 3. Verify Endpoints

```bash
# Get products
curl http://localhost:8000/api/products

# Get categories
curl http://localhost:8000/api/categories

# Get current user (requires auth token)
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚨 Common Issues & Solutions

### Database Connection Error

```bash
# Verify MySQL is running
mysql -u root

# Check credentials in .env
# Ensure database exists
# Run: php artisan migrate
```

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Kill process on port 5174
lsof -ti:5174 | xargs kill -9

# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### Dependency Issues

```bash
# Clear node_modules
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Composer cache
cd packages/backend
composer clear-cache
composer install
```

### CORS Errors

Check `SANCTUM_STATEFUL_DOMAINS` in backend `.env`:

```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:5174,localhost:8000
```

## 📝 Project Structure Decisions

### Why This Structure?

- **Monorepo** (`pnpm-workspace`) - Shared code, unified development
- **Two Frontends** - Separate UX for customers vs admins
- **Single Backend** - Unified API, multi-tenant support
- **Config Package** - Centralized, client-specific settings
- **No AWS** - VPS deployment simplicity

### Tech Stack Rationale

- **React 19** - Modern, declarative UI
- **Laravel 11** - Mature, convention-based backend
- **MySQL** - Reliable, familiar
- **Zustand** - Lightweight state management
- **Tailwind** - Rapid styling
- **Razorpay** - Indian payment gateway

## 🎓 Learning Resources

### Frontend Development

- [React.js Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router v7](https://reactrouter.com)
- [React Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)

### Backend Development

- [Laravel 11 Docs](https://laravel.com/docs)
- [Eloquent ORM](https://laravel.com/docs/eloquent)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Repository Pattern](https://laravel.com/docs/repositories)

### Design Pattern References

See [CLAUDE.md](CLAUDE.md) for:

- API client patterns
- React Query hooks
- Form validation with Zod
- State management with Zustand
- Service layer architecture
- Repository pattern implementation

## 🎨 Customization Guide

### Add New Client

```bash
# 1. Create config directory
mkdir -p packages/config/clients/my-client

# 2. Copy default client
cp -r packages/config/clients/default/* \
    packages/config/clients/my-client/

# 3. Customize theme.ts
# Edit: packages/config/clients/my-client/theme.ts

# 4. Update .env
CLIENT_ID=my-client

# 5. Create database
mysql -u root -p
> CREATE DATABASE flowershop_my_client_public;

# 6. Run migrations
php artisan migrate
```

### Customize Theme Colors

Edit: `packages/config/clients/{CLIENT_ID}/theme.ts`

```typescript
colors: {
  primary: '#8B0000',    // Your color
  secondary: '#D4AF37',
  accent: '#F5F5DC',
}
```

## 📊 Database Seeding

```bash
cd packages/backend

# Seed with fresh data
php artisan migrate:fresh --seed

# Seed specific seeder
php artisan db:seed --class=ProductSeeder

# View seeded data
php artisan tinker
> Product::count()
> Category::count()
```

## 🧪 Testing

### Frontend Tests

```bash
# Watch mode
pnpm test

# Single run (CI)
pnpm test:run

# Coverage report
pnpm test:coverage
```

### Backend Tests

```bash
cd packages/backend

# All tests
php artisan test

# Specific test
php artisan test tests/Feature/ProductTest.php

# With coverage
php artisan test --coverage
```

### E2E Tests

```bash
cd e2e

# Run all tests
pnpm test

# Interactive mode
pnpm test --ui

# Specific test file
pnpm test tests/customer-portal/auth/login.spec.ts
```

## 📞 Support & Help

### Documentation

- [CLAUDE.md](CLAUDE.md) - Complete development guide
- README files in each package
- Code comments and examples

### Debugging

- Use browser DevTools for frontend
- Use Laravel Tinker for backend
- Check logs in `packages/backend/storage/logs/`
- Enable `APP_DEBUG=true` in `.env`

### Issues

1. Check [CLAUDE.md](CLAUDE.md) troubleshooting section
2. Review existing code patterns
3. Check Laravel/React documentation
4. Test with fresh database: `php artisan migrate:fresh --seed`

## ✅ Verification Checklist

After setup, verify:

- [ ] Node.js 18+ installed
- [ ] PHP 8.3+ installed
- [ ] MySQL running
- [ ] Dependencies installed (`pnpm install`)
- [ ] Environment files created (`.env`, `packages/backend/.env`)
- [ ] Database created and migrated
- [ ] Backend starts (`php artisan serve`)
- [ ] Customer portal starts (`pnpm --filter @flowershop/customer-portal dev`)
- [ ] Admin dashboard starts (`pnpm --filter @flowershop/admin-dashboard dev`)
- [ ] API responds (`curl http://localhost:8000/api/products`)
- [ ] Frontend connects to API

## 🎉 You're Ready!

Your FlowerShop project is now set up. Start building amazing features!

### Quick Launch Commands

```bash
# Terminal 1 - Backend
cd packages/backend && php artisan serve --port=8000

# Terminal 2 - All Frontends
pnpm dev

# Terminal 3 (Optional) - Database management
cd packages/backend && php artisan tinker
```

Then visit:

- Customer Portal: http://localhost:5173
- Admin Dashboard: http://localhost:5174
- Backend API: http://localhost:8000

---

**Happy Coding! 🌸**

For detailed information, see [CLAUDE.md](CLAUDE.md)
