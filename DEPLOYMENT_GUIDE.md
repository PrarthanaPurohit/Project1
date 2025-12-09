# Deployment Guide

This guide provides step-by-step instructions for deploying the MERN Showcase Platform to production.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Post-Deployment](#post-deployment)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Pre-Deployment Checklist

Before deploying, ensure you have completed the following:

### Security

- [ ] Changed default admin credentials
- [ ] Generated a strong JWT_SECRET (minimum 32 random characters)
- [ ] Configured CORS to allow only your frontend domain
- [ ] Reviewed and secured all environment variables
- [ ] Enabled HTTPS/SSL certificates
- [ ] Implemented rate limiting on API endpoints
- [ ] Added security headers using helmet.js
- [ ] Disabled detailed error messages in production

### Database

- [ ] Set up MongoDB Atlas account or secure MongoDB instance
- [ ] Created production database
- [ ] Configured database authentication
- [ ] Set up automated backups
- [ ] Created necessary database indexes
- [ ] Tested database connection

### Code

- [ ] All tests passing
- [ ] Code reviewed and optimized
- [ ] Removed console.logs and debug code
- [ ] Updated API URLs to production endpoints
- [ ] Built frontend for production
- [ ] Verified image upload functionality

### Documentation

- [ ] Updated README with production URLs
- [ ] Documented deployment process
- [ ] Created runbook for common issues
- [ ] Documented environment variables

## Environment Configuration

### Production Environment Variables

#### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/showcase?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_very_long_and_secure_random_string_here_minimum_32_characters
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS Configuration (optional, can be set in code)
FRONTEND_URL=https://your-frontend-domain.com
```

#### Frontend (.env)

```env
# API Configuration
VITE_API_URL=https://your-backend-domain.com/api

# Environment
VITE_NODE_ENV=production
```

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "Shared" (free tier) or paid tier
   - Select your cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set permissions to "Read and write to any database"

4. **Configure Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Add your current IP
   - For production: Add your server's IP or "0.0.0.0/0" (allow from anywhere)

5. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `showcase`

6. **Seed Production Database:**
   ```bash
   # Set MONGODB_URI to production database
   export MONGODB_URI="your_production_mongodb_uri"
   npm run seed
   ```

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku App:**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your_mongodb_uri"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set JWT_EXPIRE=7d
   heroku config:set MAX_FILE_SIZE=5242880
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Verify Deployment:**
   ```bash
   heroku logs --tail
   heroku open
   ```

### Option 2: DigitalOcean App Platform

1. **Create Account:**
   - Sign up at [DigitalOcean](https://www.digitalocean.com/)

2. **Create New App:**
   - Go to "Apps" → "Create App"
   - Connect your GitHub repository
   - Select the backend directory

3. **Configure Build Settings:**
   - Build Command: `npm install`
   - Run Command: `npm start`

4. **Set Environment Variables:**
   - Add all environment variables from your `.env` file

5. **Deploy:**
   - Click "Create Resources"
   - Wait for deployment to complete

### Option 3: AWS EC2

1. **Launch EC2 Instance:**
   - Choose Ubuntu Server 22.04 LTS
   - Select instance type (t2.micro for free tier)
   - Configure security group (allow ports 22, 80, 443, 5000)

2. **Connect to Instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install -y nginx
   ```

4. **Clone and Setup Application:**
   ```bash
   git clone your-repository-url
   cd mern-showcase-platform/backend
   npm install
   ```

5. **Create .env File:**
   ```bash
   nano .env
   # Add your environment variables
   ```

6. **Start with PM2:**
   ```bash
   pm2 start server.js --name showcase-backend
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/showcase
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/showcase /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

4. **Set Environment Variables:**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add `VITE_API_URL` with your backend URL

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build Application:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Set Environment Variables:**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add `VITE_API_URL`

### Option 3: AWS S3 + CloudFront

1. **Build Application:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket:**
   - Go to AWS S3 console
   - Create new bucket
   - Enable static website hosting
   - Set bucket policy for public read access

3. **Upload Build Files:**
   ```bash
   aws s3 sync build/ s3://your-bucket-name
   ```

4. **Create CloudFront Distribution:**
   - Go to CloudFront console
   - Create distribution
   - Set origin to your S3 bucket
   - Configure SSL certificate

5. **Update DNS:**
   - Point your domain to CloudFront distribution

## Post-Deployment

### Verify Deployment

1. **Test Backend API:**
   ```bash
   curl https://your-backend-domain.com/api/projects
   ```

2. **Test Frontend:**
   - Visit your frontend URL
   - Test all features:
     - View projects and clients
     - Submit contact form
     - Subscribe to newsletter
     - Login to admin panel
     - Create/edit/delete projects and clients

3. **Test Image Upload:**
   - Upload an image in admin panel
   - Verify it's cropped to 450x350
   - Check image loads on landing page

### Seed Production Database

```bash
# SSH into your backend server or use Heroku CLI
cd backend
npm run seed

# Or with sample data
npm run seed:samples
```

### Update Admin Credentials

1. Login with default credentials
2. Create a new admin user with secure credentials
3. Delete or disable the default admin user

### Configure Monitoring

1. **Set up Error Tracking:**
   - Install Sentry or similar service
   - Add error tracking to backend and frontend

2. **Set up Uptime Monitoring:**
   - Use UptimeRobot or Pingdom
   - Monitor both backend and frontend

3. **Set up Log Aggregation:**
   - Use Papertrail, Loggly, or CloudWatch
   - Configure log retention policies

## Monitoring and Maintenance

### Regular Maintenance Tasks

**Daily:**
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review contact submissions

**Weekly:**
- [ ] Review performance metrics
- [ ] Check database size and growth
- [ ] Review security logs
- [ ] Update dependencies (if needed)

**Monthly:**
- [ ] Database backup verification
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Update documentation

### Backup Strategy

1. **Database Backups:**
   - MongoDB Atlas: Automatic backups enabled by default
   - Self-hosted: Set up automated backups with mongodump

2. **Image Backups:**
   - Sync uploads folder to cloud storage (S3, Google Cloud Storage)
   - Set up automated backup script

3. **Code Backups:**
   - Ensure code is in version control (Git)
   - Tag releases for easy rollback

### Scaling Considerations

**When to Scale:**
- Response times > 500ms
- CPU usage consistently > 70%
- Memory usage consistently > 80%
- Database connections maxed out

**Scaling Options:**
- Vertical scaling: Upgrade server resources
- Horizontal scaling: Add more server instances
- Database scaling: Use MongoDB sharding or read replicas
- CDN: Use CloudFront or Cloudflare for static assets
- Caching: Implement Redis for API responses

### Rollback Procedure

If deployment fails:

1. **Identify Issue:**
   - Check error logs
   - Review recent changes

2. **Rollback Backend:**
   ```bash
   # Heroku
   heroku rollback

   # PM2
   pm2 restart showcase-backend
   git checkout previous-commit
   npm install
   pm2 restart showcase-backend
   ```

3. **Rollback Frontend:**
   ```bash
   # Vercel
   vercel rollback

   # Manual
   git checkout previous-commit
   npm run build
   vercel --prod
   ```

4. **Verify:**
   - Test all critical functionality
   - Monitor error rates

## Troubleshooting

### Common Production Issues

**Issue: 502 Bad Gateway**
- Check if backend server is running
- Verify environment variables are set
- Check database connection

**Issue: CORS Errors**
- Verify CORS configuration in backend
- Ensure frontend URL is whitelisted
- Check for trailing slashes in URLs

**Issue: Images Not Loading**
- Check file permissions on uploads folder
- Verify image paths in database
- Check CDN configuration if using one

**Issue: Database Connection Timeout**
- Verify MongoDB URI is correct
- Check network access settings in MongoDB Atlas
- Ensure server IP is whitelisted

## Security Best Practices

1. **Keep Dependencies Updated:**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Use Environment Variables:**
   - Never commit secrets to version control
   - Use different secrets for each environment

3. **Implement Rate Limiting:**
   - Protect against brute force attacks
   - Limit API requests per IP

4. **Regular Security Audits:**
   - Review access logs
   - Check for suspicious activity
   - Update security policies

5. **Backup Regularly:**
   - Automated daily backups
   - Test restore procedures
   - Store backups securely

## Support

For deployment issues:
1. Check application logs
2. Review this guide
3. Consult platform-specific documentation
4. Open an issue on the repository

---

**Remember:** Always test in a staging environment before deploying to production!
