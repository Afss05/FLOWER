# 📚 FlowerShop Complete Backend Setup - Step-by-Step Documentation

**Project:** FlowerShop - South Indian Flower & Pooja eCommerce Platform  
**Setup Date:** May 28, 2026  
**Backend Stack:** PHP 8.3 + Laravel 11 + MySQL 8.0 + Composer  

---

## 🎯 Overview

This document provides **detailed, step-by-step instructions** to set up the complete FlowerShop project with both frontend (React) and backend (Laravel) services running simultaneously.

---

## 📋 What You'll Get

By following this guide, you'll have:

✅ **Customer Portal** (React) - http://localhost:5173  
✅ **Admin Dashboard** (React) - http://localhost:5174  
✅ **Backend API** (Laravel) - http://localhost:8000  
✅ **Database** (MySQL) - Fully configured and seeded with sample data  
✅ **All Dependencies** - PHP, MySQL, Composer installed and configured  

---

## 🔧 Prerequisites (Already Have)

- Windows 10 or Windows 11
- Node.js 18+ ✅
- pnpm 8.15.0 ✅
- Chocolatey 2.6.0 ✅
- FlowerShop project code ✅

---

## ⚡ Quick Start (For Advanced Users)

If you already have PHP 8.3+, MySQL 8.0+, and Composer installed:

```powershell
# 1. Navigate to project root
cd C:\Users\USER\Documents\SKD\FlowerShop

# 2. Run backend setup script
.\setup-backend.ps1

# 3. Start three servers (in separate terminals)
# Terminal 1:
cd packages\customer-portal && pnpm dev

# Terminal 2:
cd packages\admin-dashboard && pnpm dev

# Terminal 3:
cd packages\backend && php artisan serve --port=8000

# Access:
# - http://localhost:5173 (Customer Portal)
# - http://localhost:5174 (Admin Dashboard)
# - http://localhost:8000 (Backend API)
```

---

## 📖 Complete Step-by-Step Setup

### **Phase 1: Install System Dependencies**

If you **DON'T** have PHP, MySQL, and Composer yet, follow these steps:

#### **1.1 Install PHP 8.3**

**Download & Extract:**
```powershell
# Create PHP directory
New-Item -ItemType Directory -Path "C:\php" -Force | Out-Null

# Download PHP 8.3 (or manually from https://windows.php.net/download/)
# Extract the zip file to C:\php

# Navigate to PHP directory
cd C:\php
```

**Configure PHP:**
```powershell
# Copy php.ini configuration
Copy-Item "php.ini-development" "php.ini" -Force

# Edit php.ini to enable extensions (optional but recommended)
# Open with: notepad C:\php\php.ini
# Find and uncomment these lines:
# extension=pdo_mysql
# extension=fileinfo
# extension=gd
```

**Add PHP to Windows PATH:**

**Option A: Temporary (current session only)**
```powershell
$env:Path += ";C:\php"
php -v  # Should show PHP 8.3.0
```

**Option B: Permanent (all sessions)**
1. Press `Win + X`, select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", click "New"
5. Variable name: `PATH`
6. Variable value: `C:\php`
7. Click OK, OK, OK
8. **Restart PowerShell**
9. Verify: `php -v` should show PHP 8.3.0

---

#### **1.2 Install MySQL 8.0**

**Download & Install:**
1. Visit: https://dev.mysql.com/downloads/mysql/
2. Download: **MySQL Community Server (Windows Installer)**
3. Run the `.msi` installer
4. Configuration:
   - Setup Type: **Detailed Configuration**
   - Server type: **Development Machine**
   - Install as Windows Service: **Yes**
   - MySQL port: **3306** (default)
   - Root password: **Set a strong password** ⚠️ Remember this!

**Add MySQL to PATH (if not added automatically):**
```powershell
$env:Path += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql --version  # Should show MySQL 8.0.x
```

**Verify MySQL is Running:**
```powershell
# Start MySQL service
Start-Service MySQL80  # (or your MySQL service name)

# Test connection
mysql -u root -p
# Enter the password you set during installation
# Type: exit
```

---

#### **1.3 Install Composer**

**Download & Install:**
1. Visit: https://getcomposer.org/download/
2. Download: **Composer-Setup.exe (Windows Installer)**
3. Run the installer
4. When asked: "Where is the PHP.exe file located?"
   - Browse to: `C:\php\php.exe`
5. Complete installation
6. Restart PowerShell

**Verify Composer:**
```powershell
composer --version  # Should show Composer version 2.x.x
```

---

### **Phase 2: Create MySQL Database & User**

```powershell
# Open MySQL connection
mysql -u root -p

# When prompted, enter your MySQL root password
```

**In MySQL prompt, run these commands:**

```sql
-- Create the database
CREATE DATABASE flowershop_default_public;

-- Create database user
CREATE USER 'flowershop'@'localhost' IDENTIFIED BY 'flowershop123';

-- Grant all permissions to the user
GRANT ALL PRIVILEGES ON flowershop_default_public.* TO 'flowershop'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify (optional)
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

---

### **Phase 3: Setup Frontend Applications**

#### **3.1 Install Frontend Dependencies**

```powershell
# Navigate to project root
cd C:\Users\USER\Documents\SKD\FlowerShop

# Install all dependencies
pnpm install

# Expected output: +449 packages installed (with non-critical husky warning)
```

---

### **Phase 4: Setup Laravel Backend**

#### **4.1 Install PHP Dependencies**

```powershell
# Navigate to backend directory
cd C:\Users\USER\Documents\SKD\FlowerShop\packages\backend

# Install Composer dependencies
composer install

# This will install ~100 Laravel packages and dependencies
```

#### **4.2 Configure Environment File**

```powershell
# Copy example environment file
Copy-Item ".env.example" ".env" -Force

# Open .env in notepad
notepad .env

# Update these values:
```

**Edit .env file - Key Settings:**

```env
# Application
APP_NAME=FlowerShop
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=flowershop_default_public
DB_USERNAME=flowershop
DB_PASSWORD=flowershop123

# Session/Cookie
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:5174,localhost:8000
```

**Save the file.**

#### **4.3 Generate Application Key**

```powershell
# Still in packages\backend directory
php artisan key:generate

# Expected output:
# Application key [base64:xxxxx] set successfully.
```

#### **4.4 Run Database Migrations**

```powershell
# Still in packages\backend directory

# Create all database tables
php artisan migrate

# Expected output shows tables being created:
# Creating table tenants
# Created table tenants
# Creating table users
# Created table users
# ... (more tables)
# Migration complete
```

#### **4.5 Seed Sample Data**

```powershell
# Still in packages\backend directory

# Populate database with sample data
php artisan db:seed

# Expected output:
# Database seeding completed successfully.
# Created 2 users, 4 categories, 4 products, etc.
```

---

### **Phase 5: Start All Services**

You need **three separate PowerShell/Terminal windows** running simultaneously.

#### **Terminal 1: Start Customer Portal**

```powershell
cd C:\Users\USER\Documents\SKD\FlowerShop\packages\customer-portal
pnpm dev

# Expected output:
# VITE v5.4.21 ready in 515 ms
# ➜  Local:   http://localhost:5173/
# ➜  Press q to quit
```

**Access:** http://localhost:5173

#### **Terminal 2: Start Admin Dashboard**

```powershell
cd C:\Users\USER\Documents\SKD\FlowerShop\packages\admin-dashboard
pnpm dev

# Expected output:
# VITE v5.4.21 ready in 408 ms
# ➜  Local:   http://localhost:5174/
# ➜  Press q to quit
```

**Access:** http://localhost:5174

#### **Terminal 3: Start Backend API**

```powershell
cd C:\Users\USER\Documents\SKD\FlowerShop\packages\backend
php artisan serve --port=8000

# Expected output:
# Starting Laravel development server: http://127.0.0.1:8000
# [date/time] Local:   http://127.0.0.1:8000
# [date/time] Press Ctrl+C to quit
```

**Access:** http://localhost:8000

---

### **Phase 6: Verify Everything Works**

#### **6.1 Run Verification Script**

```powershell
# In any terminal, navigate to project root
cd C:\Users\USER\Documents\SKD\FlowerShop

# Run verification script
.\verify-setup.ps1

# Expected: All services check complete
```

#### **6.2 Manual Verification**

**Test Customer Portal:**
- Open: http://localhost:5173
- Should see home page with products
- Try navigation, add to cart, etc.

**Test Admin Dashboard:**
- Open: http://localhost:5174
- Should see dashboard layout
- Try navigation, view sample products

**Test Backend API:**
- Open: http://localhost:8000/api/products
- Should see JSON response with products array
- Example: `{"data":[{"id":1,"name":"Rose Flowers",...}]}`

**Test Database:**
```powershell
mysql -u flowershop -p flowershop123 flowershop_default_public -e "SELECT COUNT(*) as 'Product Count' FROM products;"

# Expected output: Product Count | 4
```

---

## 📊 Project Architecture

```
FlowerShop/
├── 📱 Customer Portal (React)
│   ├── Port: 5173
│   ├── URL: http://localhost:5173
│   └── Features: Product browsing, cart, orders
│
├── 🛠️ Admin Dashboard (React)
│   ├── Port: 5174
│   ├── URL: http://localhost:5174
│   └── Features: Product management, orders, analytics
│
├── 🔌 Backend API (Laravel)
│   ├── Port: 8000
│   ├── URL: http://localhost:8000
│   └── Features: REST API endpoints, database operations
│
└── 🗄️ MySQL Database
    ├── Database: flowershop_default_public
    ├── User: flowershop
    └── Tables: 14+ tables for users, products, orders, etc.
```

---

## 🐛 Troubleshooting

### **Problem: "PHP command not found"**

**Solution:**
```powershell
# Check if PHP is installed
Test-Path "C:\php\php.exe"

# Add to PATH temporarily
$env:Path += ";C:\php"

# Verify
php -v

# For permanent fix: Add C:\php to Windows Environment Variables (see Phase 1)
```

---

### **Problem: "MySQL command not found"**

**Solution:**
```powershell
# Check if MySQL is installed
Get-Service MySQL80

# Add to PATH temporarily
$env:Path += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"

# Verify
mysql --version

# Start MySQL service
Start-Service MySQL80
```

---

### **Problem: "Composer command not found"**

**Solution:**
```powershell
# Restart PowerShell or system
# Composer should be added to PATH during installation

# Verify
composer --version

# If still not found, reinstall Composer with correct PHP path
```

---

### **Problem: Database connection error in Laravel**

**Solution:**
```powershell
# 1. Verify MySQL is running
Start-Service MySQL80

# 2. Test credentials
mysql -u flowershop -p flowershop123 -e "SELECT 1;"

# 3. Check .env file (should be in packages/backend/.env)
# Verify these values:
# DB_USERNAME=flowershop
# DB_PASSWORD=flowershop123
# DB_DATABASE=flowershop_default_public

# 4. If still failing, reset database:
php artisan migrate:fresh
php artisan db:seed
```

---

### **Problem: "Port 5173/5174/8000 already in use"**

**Solution:**
```powershell
# Find process using the port
netstat -ano | findstr :5173

# Kill the process (replace PID with the process ID)
taskkill /PID <PID> /F

# Or use a different port
# Frontend: pnpm dev -- --port 5175
# Backend: php artisan serve --port 8001
```

---

### **Problem: "CORS error" when frontend calls API**

**Check .env in backend:**
```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:5174,localhost:8000
SESSION_DOMAIN=localhost
```

**Then run:**
```powershell
php artisan cache:clear
php artisan config:clear
php artisan serve --port=8000
```

---

## 📝 Common Commands Reference

```powershell
# Navigate to directories
cd C:\Users\USER\Documents\SKD\FlowerShop  # Project root
cd packages\customer-portal  # Customer frontend
cd packages\admin-dashboard  # Admin frontend
cd packages\backend  # Laravel backend

# Start services
pnpm dev  # Frontend (in customer-portal or admin-dashboard)
php artisan serve --port=8000  # Backend

# Database operations
php artisan migrate  # Run migrations
php artisan migrate:fresh  # Reset all tables
php artisan db:seed  # Seed sample data
php artisan migrate:fresh --seed  # Reset & reseed
php artisan tinker  # Interactive PHP shell

# Composer operations
composer install  # Install dependencies
composer update  # Update packages
composer require package/name  # Install new package

# Laravel utilities
php artisan make:model ModelName  # Create model
php artisan make:controller ControllerName  # Create controller
php artisan make:migration create_table_name  # Create migration
php artisan health  # Check application health
php artisan cache:clear  # Clear cache
```

---

## ✅ Post-Setup Checklist

- [ ] PHP 8.3+ installed and in PATH
- [ ] MySQL 8.0+ installed, running, and password set
- [ ] Composer 2.0+ installed and in PATH
- [ ] Database `flowershop_default_public` created
- [ ] Database user `flowershop` created with password `flowershop123`
- [ ] Frontend dependencies installed (`pnpm install`)
- [ ] Backend dependencies installed (`composer install`)
- [ ] Laravel `.env` configured with database details
- [ ] Application key generated (`php artisan key:generate`)
- [ ] Migrations run (`php artisan migrate`)
- [ ] Database seeded (`php artisan db:seed`)
- [ ] Customer Portal running on http://localhost:5173
- [ ] Admin Dashboard running on http://localhost:5174
- [ ] Backend API running on http://localhost:8000
- [ ] All three services accessible and responsive
- [ ] Sample products visible in Customer Portal
- [ ] API returns product data at http://localhost:8000/api/products

---

## 🎓 What's Next?

After successful setup:

1. **Explore the applications:**
   - Browse products in Customer Portal
   - Navigate Admin Dashboard
   - Test API endpoints

2. **Understand the architecture:**
   - Read CLAUDE.md for complete documentation
   - Review backend API routes in `packages/backend/routes/api.php`
   - Review frontend routes in `packages/customer-portal/src/routes/index.tsx`

3. **Customize for your needs:**
   - Update theme in `packages/config/clients/default/theme.ts`
   - Add new features to backend
   - Modify frontend UI components

4. **Deploy to production:**
   - Configure production environment
   - Set up database backups
   - Deploy frontend to Vercel/Netlify
   - Deploy backend to VPS

---

## 📞 Support Resources

- **Laravel Docs:** https://laravel.com/docs/11
- **React Docs:** https://react.dev
- **MySQL Docs:** https://dev.mysql.com/doc/
- **Composer Docs:** https://getcomposer.org/doc/
- **Project Docs:** See CLAUDE.md in project root

---

**Setup Documentation Created:** May 28, 2026  
**Last Updated:** May 28, 2026  
**Status:** ✅ Complete and Ready for Implementation

---

*For questions or issues, refer to the Troubleshooting section or check individual tool documentation.*
