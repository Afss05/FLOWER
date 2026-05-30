@echo off
REM FlowerShop Backend Installation Script
REM This script installs PHP, MySQL, and Composer

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║    FlowerShop Backend Installation Script         ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Check if already installed
echo [1/5] Checking existing installations...
where php >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ PHP already installed
    php -v
    set PHP_INSTALLED=1
)

where mysql >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MySQL already installed
    mysql --version
    set MYSQL_INSTALLED=1
)

where composer >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Composer already installed
    composer --version
    set COMPOSER_INSTALLED=1
)

if "%PHP_INSTALLED%"=="1" if "%MYSQL_INSTALLED%"=="1" if "%COMPOSER_INSTALLED%"=="1" (
    echo.
    echo ✓ All tools already installed!
    goto setup_backend
)

REM Install with Chocolatey
echo.
echo [2/5] Installing missing tools with Chocolatey...
echo Please make sure to run PowerShell as Administrator for this to work!
echo.

if "%PHP_INSTALLED%"=="" (
    echo Installing PHP...
    choco install php -y
)

if "%MYSQL_INSTALLED%"=="" (
    echo Installing MySQL...
    choco install mysql -y
)

if "%COMPOSER_INSTALLED%"=="" (
    echo Installing Composer...
    choco install composer -y
)

REM Refresh PATH
set "PATH=%PATH%;C:\php;C:\Program Files\MySQL\MySQL Server 8.0\bin"

:setup_backend
echo.
echo [3/5] Setting up backend...
cd /d "%~dp0packages\backend"

REM Copy .env
if not exist ".env" (
    echo Creating .env file...
    copy ".env.example" ".env"
)

REM Install Composer dependencies
echo Installing Composer dependencies...
composer install

REM Generate key
echo Generating Laravel key...
php artisan key:generate

REM Create database
echo.
echo [4/5] Creating MySQL database...
echo Enter your MySQL root password (press Enter if none):
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS flowershop_default_public;"
mysql -u root -p -e "CREATE USER IF NOT EXISTS 'flowershop'@'localhost' IDENTIFIED BY 'flowershop123';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON flowershop_default_public.* TO 'flowershop'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

REM Run migrations
echo Running migrations...
php artisan migrate --force

REM Seed database
echo Seeding database...
php artisan db:seed --force

echo.
echo [5/5] Verification...
echo.
php -v
mysql --version
composer --version

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║         Installation Complete!                    ║
echo ║                                                    ║
echo ║  To start the project, open 3 terminals:          ║
echo ║                                                    ║
echo ║  Terminal 1:                                       ║
echo ║  cd packages\customer-portal                       ║
echo ║  pnpm dev                                          ║
echo ║                                                    ║
echo ║  Terminal 2:                                       ║
echo ║  cd packages\admin-dashboard                       ║
echo ║  pnpm dev                                          ║
echo ║                                                    ║
echo ║  Terminal 3:                                       ║
echo ║  cd packages\backend                               ║
echo ║  php artisan serve --port=8000                     ║
echo ║                                                    ║
echo ║  Then access:                                      ║
echo ║  - http://localhost:5173  (Customer Portal)       ║
echo ║  - http://localhost:5174  (Admin Dashboard)       ║
echo ║  - http://localhost:8000  (Backend API)           ║
echo ╚════════════════════════════════════════════════════╝
echo.

pause
