
# Deployment Guide

## Production Setup

### 1. Environment Configuration

Create production `.env` file:

```env
# Production Database
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_NAME=stockacc_db

# Production Server
PORT=3001
NODE_ENV=production

# Security
JWT_SECRET=your-super-secure-production-jwt-secret
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# CORS
FRONTEND_URL=https://your-production-domain.com

# SSL/TLS
SSL_CERT_PATH=/path/to/ssl/cert.pem
SSL_KEY_PATH=/path/to/ssl/key.pem
```

### 2. Database Setup

1. **Create Production Database**
   ```sql
   CREATE SCHEMA `stockacc_db`;
   ```

2. **Run Schema Script**
   ```bash
   mysql -h your-host -u your-user -p stockacc_db < database/schema.sql
   ```

3. **Verify Tables**
   ```sql
   USE stockacc_db;
   SHOW TABLES;
   ```

### 3. Backend Deployment

#### Option A: PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name "stockacc-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Option B: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

### 4. Frontend Deployment

Update API base URL in frontend:
```typescript
// src/services/api/core.ts
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

### 5. Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure JWT secret (min 256 bits)
- [ ] Enable CORS for specific domains only
- [ ] Implement rate limiting
- [ ] Use helmet.js for security headers
- [ ] Validate and sanitize all inputs
- [ ] Use prepared statements for database queries
- [ ] Enable database SSL connections
- [ ] Implement proper error handling
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Database backups configured

## Monitoring

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# Check logs
pm2 logs stockacc-backend

# Restart application
pm2 restart stockacc-backend
```

### Database Monitoring
```sql
-- Check database performance
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Questions';
```

## Backup Strategy

### Database Backup
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +"%Y%m%d_%H%M%S")
mysqldump -h localhost -u root -p stockacc_db > backup_$DATE.sql
```

### Application Backup
```bash
# Code backup
tar -czf app_backup_$(date +%Y%m%d).tar.gz /path/to/application
```

