# NestEase Deployment Guide

This guide covers the deployment process for both the NestEase frontend and backend applications.

## System Requirements

### Server Requirements
- CPU: 2+ cores
- RAM: 4GB minimum
- Storage: 20GB minimum
- OS: Ubuntu 20.04 LTS or later

### Software Requirements
- Node.js 18.x or later
- npm 9.x or later
- MySQL 8.x
- Nginx
- PM2
- Redis (optional, for caching)

## Architecture Overview

```
Client -> Nginx -> Frontend (Next.js)
                -> Backend (NestJS) -> MySQL
```

## Deployment Steps

### 1. Server Setup

1. Update system:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Install required software:
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# MySQL
sudo apt install -y mysql-server

# Nginx
sudo apt install -y nginx

# PM2
sudo npm install -g pm2

# Redis (optional)
sudo apt install -y redis-server
```

3. Configure firewall:
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Database Setup

1. Secure MySQL:
```bash
sudo mysql_secure_installation
```

2. Create database and user:
```sql
CREATE DATABASE nestease_production;
CREATE USER 'nestease_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON nestease_production.* TO 'nestease_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Application Deployment

#### Frontend Deployment

1. Clone repository:
```bash
git clone https://github.com/your-org/nestease-frontend.git
cd nestease-frontend
```

2. Install dependencies:
```bash
npm ci
```

3. Build application:
```bash
npm run build
```

4. Configure Nginx:
```bash
sudo nano /etc/nginx/sites-available/nestease-frontend
```

5. Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/nestease-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Backend Deployment

1. Clone repository:
```bash
git clone https://github.com/your-org/nestease-backend.git
cd nestease-backend
```

2. Install dependencies:
```bash
npm ci
```

3. Build application:
```bash
npm run build
```

4. Configure PM2:
```bash
pm2 start ecosystem.config.js --env production
```

5. Configure Nginx:
```bash
sudo nano /etc/nginx/sites-available/nestease-backend
```

6. Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/nestease-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL Configuration

1. Install Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com -d api.your-domain.com
```

### 5. Monitoring Setup

1. Configure PM2 monitoring:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

2. Set up monitoring dashboard:
```bash
pm2 install pm2-server-monit
```

### 6. Backup Strategy

1. Database backup script:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/nestease"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mysqldump -u nestease_user -p nestease_production > $BACKUP_DIR/db_$TIMESTAMP.sql
```

2. File backup script:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/nestease"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
tar -czf $BACKUP_DIR/files_$TIMESTAMP.tar.gz /var/www/nestease-frontend /var/www/nestease-backend
```

3. Set up cron jobs:
```bash
0 2 * * * /path/to/db_backup.sh
0 3 * * * /path/to/files_backup.sh
```

## Health Checks

### Frontend Health Check
```bash
curl -I https://your-domain.com/health
```

### Backend Health Check
```bash
curl -I https://api.your-domain.com/health
```

## Monitoring

### Application Monitoring
- PM2 Dashboard: `pm2 monit`
- Nginx Status: `sudo systemctl status nginx`
- MySQL Status: `sudo systemctl status mysql`

### Resource Monitoring
- CPU Usage: `top` or `htop`
- Memory Usage: `free -m`
- Disk Usage: `df -h`

## Troubleshooting

### Common Issues

1. Application not starting:
```bash
pm2 logs nestease-backend
pm2 logs nestease-frontend
```

2. Nginx errors:
```bash
sudo tail -f /var/log/nginx/error.log
```

3. Database connection issues:
```bash
sudo tail -f /var/log/mysql/error.log
```

### Performance Issues

1. Check application logs:
```bash
pm2 logs
```

2. Monitor system resources:
```bash
htop
```

3. Check Nginx access logs:
```bash
sudo tail -f /var/log/nginx/access.log
```

## Maintenance

### Regular Maintenance Tasks

1. Update system:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Update Node.js:
```bash
sudo npm install -g npm@latest
```

3. Update PM2:
```bash
sudo npm install -g pm2@latest
```

4. Rotate logs:
```bash
pm2 flush
sudo logrotate -f /etc/logrotate.conf
```

### Security Maintenance

1. Update SSL certificates:
```bash
sudo certbot renew --dry-run
```

2. Check for security updates:
```bash
npm audit
```

3. Update dependencies:
```bash
npm update
```

## Rollback Procedure

### Frontend Rollback

1. Stop current version:
```bash
pm2 stop nestease-frontend
```

2. Revert to previous version:
```bash
git checkout <previous-version>
npm run build
pm2 start nestease-frontend
```

### Backend Rollback

1. Stop current version:
```bash
pm2 stop nestease-backend
```

2. Revert to previous version:
```bash
git checkout <previous-version>
npm run build
pm2 start nestease-backend
```

## Support

For deployment support, contact:
- Technical Support: support@nestease.com
- Emergency Contact: emergency@nestease.com

## Additional Resources

1. Documentation:
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NestJS Deployment](https://docs.nestjs.com/techniques/deployment)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

2. Monitoring Tools:
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [Sentry](https://sentry.io/)

3. Security Tools:
- [Let's Encrypt](https://letsencrypt.org/)
- [Mozilla SSL Config Generator](https://ssl-config.mozilla.org/)
- [Security Headers](https://securityheaders.com/) 