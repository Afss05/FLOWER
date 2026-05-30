# MySQL Setup Guide for FlowerShop Backend

## Current Status ✓
- **Backend running**: http://localhost:8000/api
- **Admin Dashboard**: http://localhost:5174
- **Customer Portal**: http://localhost:5173
- **MySQL connection**: ⚠️ Not connected (development mode allows this)

---

## Option 1: MySQL with Docker (Recommended - Easiest)

### Prerequisites
- Docker installed ([Download Docker Desktop](https://www.docker.com/products/docker-desktop))

### Setup
```bash
# Start MySQL 8.0 container
docker run -d \
  --name flowershop-mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=flowershop_default_public \
  mysql:8.0

# Verify it's running
docker ps | grep flowershop-mysql
```

### Stop/Start MySQL
```bash
# Stop MySQL
docker stop flowershop-mysql

# Start MySQL again
docker start flowershop-mysql

# Remove MySQL (if needed)
docker rm flowershop-mysql
```

---

## Option 2: MySQL with XAMPP (Windows)

### Prerequisites
- [Download XAMPP](https://www.apachefriends.org/download.html)

### Setup
1. **Install XAMPP** with MySQL selected
2. **Open XAMPP Control Panel**
3. **Start MySQL** by clicking "Start" next to MySQL
4. The `.env` file is already configured for XAMPP defaults

### Troubleshooting
- If MySQL won't start, check if port 3306 is in use:
  ```powershell
  netstat -ano | findstr :3306
  ```

---

## Option 3: MySQL Standalone (Windows)

### Prerequisites
- [Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- Choose version 8.0 or higher

### Setup
1. **Install MySQL** (use root/password as configured in .env)
2. **Start MySQL Service**:
   ```powershell
   # Check if running
   Get-Service MySQL80
   
   # Start if stopped
   Start-Service MySQL80
   ```

---

## After MySQL is Running

### 1. Restart Backend
```bash
# Terminal 1 - Kill current backend (Ctrl+C)
# Then restart
cd packages/backend-nodejs
node --loader ts-node/esm src/index.ts
```

You should see:
```
✓ Database authentication successful
✓ Database models synchronized
✓ Server running on port 8000
```

### 2. Test the Backend
```bash
# Create new terminal
curl http://localhost:8000/api/health

# Or visit in browser
http://localhost:8000/api/health
```

### 3. Test with an API call
```bash
# Register new user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "9999999999"
  }'
```

---

## Development Workflow

### Start All Services (with MySQL running)
```bash
cd FlowerShop
pnpm dev
```

This starts:
- 🎨 Admin Dashboard: http://localhost:5174
- 🛍️ Customer Portal: http://localhost:5173
- 🔌 Backend API: http://localhost:8000

### Individual Service Startup

**Backend only:**
```bash
cd packages/backend-nodejs
pnpm dev
```

**Frontend only:**
```bash
cd packages/customer-portal
pnpm dev
```

**Admin Dashboard only:**
```bash
cd packages/admin-dashboard
pnpm dev
```

---

## Database Management

### Create Database (if not auto-created)
```bash
mysql -u root -p
# Enter password (empty by default for XAMPP)

# Create database
CREATE DATABASE flowershop_default_public CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# List databases
SHOW DATABASES;

# Exit
exit;
```

### View Current Database Config
Check `.env` file in `packages/backend-nodejs/`:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=flowershop_default_public
```

### Reset Database
```bash
# Backup first if needed!

# Connect to MySQL
mysql -u root -p

# Drop and recreate
DROP DATABASE flowershop_default_public;
CREATE DATABASE flowershop_default_public CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Restart backend - tables will be auto-created by Sequelize
```

---

## Common Issues

### Error: ECONNREFUSED 127.0.0.1:3306
- **Cause**: MySQL not running
- **Fix**: Start MySQL service using Docker, XAMPP, or Windows Services

### Error: ER_ACCESS_DENIED_FOR_USER 'root'@'localhost'
- **Cause**: Wrong password
- **Fix**: Update `DB_PASSWORD` in `.env` file

### Error: ER_NO_DB_ERROR
- **Cause**: Database doesn't exist
- **Fix**: Create database using SQL command above

### Port 3306 already in use
- **Cause**: MySQL running twice or another app on port
- **Fix**: Stop other instance or use different port in `.env`

---

## Next Steps

1. ✅ Backend is running (http://localhost:8000)
2. ✅ Frontend dashboards are running
3. ⏭️ **Set up MySQL** using Docker, XAMPP, or standalone
4. ⏭️ Test API endpoints
5. ⏭️ Start building features

---

## API Health Check

```bash
# Check if API is running
curl http://localhost:8000/api/health

# Response (if health endpoint exists)
{
  "status": "ok",
  "timestamp": "2026-05-28T..."
}
```

---

## Support

For issues, check:
- Backend logs in terminal for error messages
- `.env` file for configuration
- MySQL service status
- Port 3306 availability

Happy coding! 🚀
