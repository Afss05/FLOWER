@echo off
REM FlowerShop Installation Script
REM Requires: PHP 8.2+, MySQL 8, Composer, Node.js 18+, npm

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║       FlowerShop Installation Script              ║
echo ╚════════════════════════════════════════════════════╝
echo.

:: ── 1. Check tools ─────────────────────────────────────────────────────────
echo [1/4] Checking tools...

where php >nul 2>&1
if %errorlevel% equ 0 (echo ✓ PHP found) else (echo ✗ PHP not found - install from https://www.php.net & pause & exit /b 1)

where mysql >nul 2>&1
if %errorlevel% equ 0 (echo ✓ MySQL found) else (echo ✗ MySQL not found - install from https://dev.mysql.com & pause & exit /b 1)

where composer >nul 2>&1
if %errorlevel% equ 0 (echo ✓ Composer found) else (echo ✗ Composer not found - install from https://getcomposer.org & pause & exit /b 1)

where node >nul 2>&1
if %errorlevel% equ 0 (echo ✓ Node.js found) else (echo ✗ Node.js not found - install from https://nodejs.org & pause & exit /b 1)

where npm >nul 2>&1
if %errorlevel% equ 0 (echo ✓ npm found) else (echo ✗ npm not found - install Node.js from https://nodejs.org & pause & exit /b 1)

:: ── 2. PHP backend ──────────────────────────────────────────────────────────
echo.
echo [2/4] Setting up PHP backend...
cd /d "%~dp0packages\backend-php"

if not exist ".env" (
    echo   Creating .env from .env.example...
    copy ".env.example" ".env"
    echo   ⚠  Edit packages\backend-php\.env and set JWT_SECRET to a 32+ char string
)

echo   Installing Composer dependencies...
composer install --no-interaction

echo   Creating MySQL database...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS flowershop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if %errorlevel% neq 0 (
    echo   Note: Could not auto-create DB. Run manually:
    echo     mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS flowershop;"
)

echo   Running migrations...
mysql -u root flowershop < database\migrations\001_create_tables.sql 2>nul
if %errorlevel% neq 0 (
    echo   Note: Run migrations manually:
    echo     mysql -u root -p flowershop ^< database\migrations\001_create_tables.sql
)

:: ── 3. Frontend packages ────────────────────────────────────────────────────
echo.
echo [3/4] Installing frontend dependencies...
cd /d "%~dp0"
npm install

:: ── 4. Done ─────────────────────────────────────────────────────────────────
echo.
echo [4/4] Done!
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║            Setup Complete!                         ║
echo ║                                                    ║
echo ║  Start the project (3 separate terminals):        ║
echo ║                                                    ║
echo ║  Terminal 1 — PHP API:                            ║
echo ║    cd packages\backend-php                        ║
echo ║    composer run start                             ║
echo ║    → http://localhost:8080                        ║
echo ║                                                    ║
echo ║  Terminal 2 — Customer Portal:                    ║
echo ║    cd packages\customer-portal                    ║
echo ║    npm run dev                                    ║
echo ║    → http://localhost:5173                        ║
echo ║                                                    ║
echo ║  Terminal 3 — Admin Dashboard:                    ║
echo ║    cd packages\admin-dashboard                    ║
echo ║    npm run dev                                    ║
echo ║    → http://localhost:5174                        ║
echo ║                                                    ║
echo ║  Test credentials:                                ║
echo ║    customer@flowershop.com / Customer@12345       ║
echo ║    admin@flowershop.com    / Admin@12345          ║
echo ╚════════════════════════════════════════════════════╝
echo.
pause
