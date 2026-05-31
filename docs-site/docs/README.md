# 🌸 FlowerShop - South Indian Flower & Pooja eCommerce Platform

A production-ready, multi-tenant flower and pooja item delivery platform inspired by Chennai Pookkadai. Built with modern tech stack for scalability and performance.

## 🎯 Project Overview

**FlowerShop** is a complete eCommerce solution featuring:

- ✨ Customer portal for flower and pooja ordering
- 👨‍💼 Admin dashboard for inventory and order management
- 📱 Mobile-first responsive design
- 🌐 Bilingual support (English + Tamil)
- 🚚 Same-day delivery system
- 📅 Subscription-based flower delivery
- 🎉 Festival special products
- 💳 Razorpay payment integration
- 🔐 Secure multi-tenant architecture

## 📋 Prerequisites

- **Node.js** 18+ / **npm** 9+ / **pnpm** 8+
- **PHP** 8.3+
- **Composer** 2+
- **MySQL** 8.0+
- **Git**

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd FlowerShop

# Install frontend & root dependencies
pnpm install

# Install backend dependencies
cd packages/backend
composer install
cd ../..
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env
cp packages/backend/.env.example packages/backend/.env

# Edit .env with your settings
# - Set DATABASE credentials
# - Set RAZORPAY keys
# - Set MAIL configuration
```

### 3. Database Setup

```bash
cd packages/backend

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed

cd ../..
```

### 4. Start Development Servers

```bash
# Terminal 1 - Start all development servers
pnpm dev

# This starts:
# - Customer Portal: http://localhost:5173
# - Admin Dashboard: http://localhost:5174
# - Backend API: http://localhost:8000
```

Alternatively, start servers individually:

```bash
# Terminal 1 - Customer Portal
pnpm --filter @flowershop/customer-portal dev

# Terminal 2 - Admin Dashboard
pnpm --filter @flowershop/admin-dashboard dev

# Terminal 3 - Backend
cd packages/backend && php artisan serve --port=8000
```

## 📁 Project Structure

```
FlowerShop/
├── packages/
│   ├── customer-portal/      # Customer-facing React app
│   ├── admin-dashboard/      # Admin portal React app
│   ├── backend/              # Laravel REST API
│   └── config/               # Shared configuration & client configs
├── docs-site/                # Documentation website
├── e2e/                       # End-to-end tests
├── CLAUDE.md                 # Development guide
└── README.md                 # This file
```

## 🔧 Available Commands

### Root Level

```bash
# Start all dev servers
pnpm dev

# Run tests
pnpm test

# Run linter
pnpm lint

# Build production
pnpm build

# Type checking
pnpm type-check
```

### Customer Portal

```bash
cd packages/customer-portal

# Development
pnpm dev

# Build
pnpm build

# Testing
pnpm test

# Linting
pnpm lint
```

### Admin Dashboard

```bash
cd packages/admin-dashboard

# Development
pnpm dev

# Build
pnpm build

# Testing
pnpm test

# Linting
pnpm lint
```

### Backend (Laravel)

```bash
cd packages/backend

# Start dev server
php artisan serve --port=8000

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Run tests
php artisan test

# Code formatting (Pint)
./vendor/bin/pint

# Clear cache
php artisan cache:clear
php artisan config:clear

# Interactive shell
php artisan tinker
```

## 🎨 Frontend Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Server state
- **Axios** - HTTP client
- **React Hook Form + Zod** - Form validation
- **Framer Motion** - Animations
- **i18next** - Internationalization

## 🔌 Backend Stack

- **Laravel 11** - Framework
- **PHP 8.3** - Language
- **MySQL 8.0** - Database
- **Laravel Sanctum** - Authentication
- **Eloquent ORM** - Database abstraction
- **Razorpay API** - Payment processing

## 🔐 Authentication

The app uses **Laravel Sanctum** for API token-based authentication:

- Tokens expire after 30 minutes
- Refresh tokens stored in HTTP-only cookies
- Support for email + password login
- OTP verification for new accounts
- Secure password reset flow

## 💳 Payment Integration

**Razorpay** payment gateway support:

- UPI payments
- Card payments
- Digital wallet payments
- Cash on Delivery (COD)
- Secure payment verification

## 🌍 Multi-Tenancy

The application supports multiple flower shop clients:

```bash
# Switch client
CLIENT_ID=default pnpm dev

# Add new client
# 1. Create config in packages/config/clients/{CLIENT_ID}/
# 2. Create database schema
# 3. Update .env with CLIENT_ID
```

## 📚 Documentation

Comprehensive guides available in [CLAUDE.md](CLAUDE.md):

- Architecture overview
- Database schema
- API endpoints
- Development workflow
- Deployment guide
- Code standards

## 🧪 Testing

### Frontend Tests

```bash
pnpm test                 # Run tests in watch mode
pnpm test:run            # Run tests once (CI mode)
pnpm test:coverage       # Generate coverage report
```

### Backend Tests

```bash
cd packages/backend
php artisan test         # Run all tests
php artisan test --filter=ProductTest  # Run specific tests
```

### E2E Tests

```bash
cd e2e
pnpm test               # Run E2E tests
pnpm test --ui         # Interactive test UI
```

## 🚀 Deployment

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
ssh user@your-server

# Clone repository and setup
git clone <repo>
cd FlowerShop/packages/backend

# Install dependencies
composer install --no-dev

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate --force

# Setup Nginx and SSL (see CLAUDE.md for details)
```

## 🔒 Environment Variables

### Root `.env`

```env
CLIENT_ID=default
VITE_API_URL=http://localhost:8000/api
VITE_RAZORPAY_KEY_ID=your_key_here
```

### Backend `.env`

```env
APP_NAME=FlowerShop
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=flowershop_default_public
DB_USERNAME=root
DB_PASSWORD=

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

MAIL_MAILER=smtp
MAIL_FROM_ADDRESS=noreply@flowershop.local
```

See `.env.example` files for complete reference.

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📝 Code Standards

- **Frontend**: React best practices, TypeScript strict mode
- **Backend**: Laravel conventions, PSR-12 coding standard
- **Commits**: Conventional commits format
- **Language**: British English for user-facing text

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check MySQL is running
mysql -u root -p

# Reset database
cd packages/backend
php artisan migrate:fresh --seed
```

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

## 📞 Support

For issues and questions:

- Open an issue on GitHub
- Check [CLAUDE.md](CLAUDE.md) for detailed guides
- Review example implementations in docs-site

## 📄 License

This project is proprietary and confidential.

## 🙏 Acknowledgments

- Inspired by Chennai Pookkadai
- Built with modern development practices
- Scalable architecture for future growth

---

**Happy Coding! 🌸**

For detailed development guide, see [CLAUDE.md](CLAUDE.md)
