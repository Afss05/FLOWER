# FlowerShop PHP Backend

REST API backend for the FlowerShop eCommerce platform built with Slim Framework 4, PHP-DI, and MySQL.

## Requirements

- PHP 8.1+
- MySQL 8.0+
- Composer

## Quick Start

### 1. Install dependencies
```bash
composer install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your DB credentials and JWT secret
```

### 3. Create database & run migrations
```sql
-- In MySQL:
CREATE DATABASE flowershop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
```bash
php database/migrate.php
```

### 4. Seed sample data
```bash
php database/seed.php
```

### 5. Start development server
```bash
composer start
# Server runs at http://localhost:8000
```

## Default Seeded Users

| Role     | Email                    | Password |
|----------|--------------------------|----------|
| Admin    | admin@flowershop.com     | password |
| Customer | customer@flowershop.com  | password |

## API Endpoints

### Auth
| Method | Path                     | Auth |
|--------|--------------------------|------|
| POST   | /api/auth/register       | No   |
| POST   | /api/auth/login          | No   |
| GET    | /api/auth/me             | Yes  |
| POST   | /api/auth/refresh        | Yes  |

### Products
| Method | Path                          | Auth |
|--------|-------------------------------|------|
| GET    | /api/products                 | No   |
| GET    | /api/products/{id}            | No   |
| GET    | /api/products/festival-specials | No |
| GET    | /api/products/trending        | No   |
| GET    | /api/products/search          | No   |
| GET    | /api/products/categories      | No   |

### Cart (requires auth)
| Method | Path                          |
|--------|-------------------------------|
| GET    | /api/cart                     |
| POST   | /api/cart/items               |
| PUT    | /api/cart/items/{id}          |
| DELETE | /api/cart/items/{id}          |
| DELETE | /api/cart                     |

### Orders (requires auth)
| Method | Path                          |
|--------|-------------------------------|
| GET    | /api/orders                   |
| POST   | /api/orders                   |
| GET    | /api/orders/{id}              |
| POST   | /api/orders/{id}/cancel       |

### Admin (requires auth + admin role)
| Method | Path                              |
|--------|-----------------------------------|
| GET    | /api/admin/dashboard              |
| GET    | /api/admin/orders                 |
| PUT    | /api/admin/orders/{id}/status     |
| GET    | /api/admin/customers              |
| POST   | /api/admin/products               |
| PUT    | /api/admin/products/{id}          |
| DELETE | /api/admin/products/{id}          |

## Project Structure

```
packages/backend-php/
├── public/
│   ├── index.php          # Entry point
│   └── .htaccess          # Apache rewrite rules
├── src/
│   ├── App/
│   │   ├── middleware.php  # Global middleware registration
│   │   └── routes.php      # All route definitions
│   ├── Config/
│   │   ├── container.php   # PHP-DI container definitions
│   │   └── Database.php    # PDO singleton
│   ├── Controllers/        # Request handlers
│   ├── Exceptions/         # Custom exception classes
│   ├── Handlers/           # Custom error handler
│   ├── Middleware/         # CORS, Auth, Role middleware
│   ├── Models/             # PDO-based data models
│   ├── Services/           # Business logic layer
│   └── Utils/
│       └── Response.php    # JSON response helpers
├── database/
│   ├── migrations/
│   │   └── 001_create_tables.sql
│   ├── seeders/
│   │   └── 001_seed_data.sql
│   ├── migrate.php
│   └── seed.php
├── storage/
│   ├── logs/
│   └── uploads/
├── .env.example
└── composer.json
```
