# NestEase Frontend Deployment Guide

## Prerequisites
- Node.js 18.x or later
- npm 9.x or later
- Nginx (for serving static files)

## Environment Configuration

Create a `.env.production` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id

# Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=your-ga-tracking-id

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Deployment Checklist

### 1. Build Preparation
- [ ] Update all dependencies
- [ ] Run tests: `npm test`
- [ ] Check for linting errors: `npm run lint`
- [ ] Verify environment variables
- [ ] Optimize images and assets

### 2. Build Process
- [ ] Create production build: `npm run build`
- [ ] Verify build output
- [ ] Test production build locally
- [ ] Generate static files: `npm run export`

### 3. Security Setup
- [ ] Configure CSP headers
- [ ] Enable HTTPS
- [ ] Set up security headers
- [ ] Configure CORS
- [ ] Implement rate limiting

### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/nestease-frontend;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.your-domain.com wss://api.your-domain.com;";

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
    gzip_disable "MSIE [1-6]\.";

    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, no-transform";
    }

    location /_next/static {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    location /static {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

### 5. Performance Optimization
- [ ] Enable compression
- [ ] Configure caching
- [ ] Optimize images
- [ ] Implement lazy loading
- [ ] Set up CDN

### 6. Monitoring Setup
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Implement analytics
- [ ] Set up alerts

### 7. Backup Strategy
- [ ] Backup static files
- [ ] Backup environment configuration
- [ ] Set up version control
- [ ] Document deployment process

## Deployment Commands

1. Install dependencies:
```bash
npm ci
```

2. Build the application:
```bash
npm run build
```

3. Export static files:
```bash
npm run export
```

4. Deploy to server:
```bash
rsync -avz --delete out/ /var/www/nestease-frontend/
```

## Performance Optimization

1. Image Optimization:
```bash
npm run optimize-images
```

2. Bundle Analysis:
```bash
npm run analyze
```

3. Lighthouse Audit:
```bash
npm run lighthouse
```

## Monitoring

1. Error Tracking:
- Set up Sentry or similar error tracking service
- Monitor JavaScript errors
- Track API failures

2. Performance Monitoring:
- Monitor Core Web Vitals
- Track page load times
- Monitor API response times

3. Analytics:
- Track user behavior
- Monitor conversion rates
- Analyze user flows

## Security Best Practices

1. Regular Security Audits:
```bash
npm audit
npm audit fix
```

2. Dependency Updates:
```bash
npm update
```

3. Security Headers:
- Implement CSP
- Enable HSTS
- Configure CORS

## Maintenance

1. Regular Updates:
```bash
npm update
```

2. Cache Management:
```bash
npm run clear-cache
```

3. Performance Monitoring:
```bash
npm run performance-check
```

## Rollback Procedure

1. Revert to previous version:
```bash
git checkout <previous-version>
npm run build
npm run export
rsync -avz --delete out/ /var/www/nestease-frontend/
```

2. Clear cache:
```bash
npm run clear-cache
```

## Support

For deployment support, contact:
- Technical Support: support@nestease.com
- Emergency Contact: emergency@nestease.com

## Additional Resources

1. Next.js Documentation:
- [Deployment](https://nextjs.org/docs/deployment)
- [Production Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)

2. Performance Tools:
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) 