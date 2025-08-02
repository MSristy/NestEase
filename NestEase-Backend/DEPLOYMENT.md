# NestEase Backend Deployment Guide

## Prerequisites
- Node.js 18.x or later
- MySQL 8.x
- PM2 (for process management)
- Nginx (for reverse proxy)

## Environment Configuration

Create a `.env.production` file with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USERNAME=your-production-db-username
DB_PASSWORD=your-production-db-password
DB_DATABASE=nestease_production

# JWT Configuration
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRATION=24h

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880 # 5MB

# Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
EMAIL_FROM=noreply@nestease.com

# Redis Configuration
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Logging Configuration
LOG_LEVEL=error
LOG_FILE=logs/production.log

# Security Configuration
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

## Deployment Checklist

### 1. Database Setup
- [ ] Create production database
- [ ] Run migrations: `npm run migration:run`
- [ ] Verify database connection
- [ ] Set up database backups

### 2. Application Setup
- [ ] Install dependencies: `npm install --production`
- [ ] Build application: `npm run build`
- [ ] Set up PM2 configuration
- [ ] Configure logging

### 3. Security Setup
- [ ] Generate strong JWT secret
- [ ] Configure CORS
- [ ] Set up rate limiting
- [ ] Enable Helmet security headers
- [ ] Configure SSL/TLS

### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'nestease-backend',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

### 6. Monitoring Setup
- [ ] Configure error logging
- [ ] Set up performance monitoring
- [ ] Configure health checks
- [ ] Set up alerts

### 7. Backup Strategy
- [ ] Database backups
- [ ] File uploads backup
- [ ] Configuration backup
- [ ] Log rotation

## Deployment Commands

1. Build the application:
```bash
npm run build
```

2. Start with PM2:
```bash
pm2 start ecosystem.config.js --env production
```

3. Monitor the application:
```bash
pm2 monit
```

4. View logs:
```bash
pm2 logs nestease-backend
```

## Health Check Endpoints

- GET `/health` - Basic health check
- GET `/health/detailed` - Detailed system status
- GET `/metrics` - Application metrics

## Troubleshooting

1. Check application logs:
```bash
tail -f logs/production.log
```

2. Check PM2 logs:
```bash
pm2 logs nestease-backend
```

3. Check Nginx logs:
```bash
tail -f /var/log/nginx/error.log
```

## Rollback Procedure

1. Stop the current version:
```bash
pm2 stop nestease-backend
```

2. Revert to previous version:
```bash
git checkout <previous-version>
npm run build
pm2 start ecosystem.config.js --env production
```

## Security Best Practices

1. Keep dependencies updated:
```bash
npm audit
npm audit fix
```

2. Regular security scans:
```bash
npm run security:scan
```

3. Monitor for vulnerabilities:
```bash
npm audit
```

## Performance Optimization

1. Enable compression
2. Configure caching
3. Optimize database queries
4. Use Redis for caching
5. Implement rate limiting

## Maintenance

1. Regular updates:
```bash
npm update
```

2. Database maintenance:
```bash
npm run db:maintenance
```

3. Log rotation:
```bash
npm run logs:rotate
```

## Support

For deployment support, contact:
- Technical Support: support@nestease.com
- Emergency Contact: emergency@nestease.com 