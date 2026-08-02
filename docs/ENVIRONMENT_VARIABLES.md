# Environment Variables Documentation

This document describes all environment variables required for running the ShopPilot application.

## Backend Environment Variables

### Server Configuration
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend application URL for CORS

### Database Configuration
- `MONGODB_URI` - MongoDB connection string
  - Example: `mongodb://localhost:27017/shoppilot`
  - Production: Use MongoDB Atlas connection string

### Redis Configuration
- `REDIS_URL` - Redis connection string
  - Example: `redis://localhost:6379`
  - Production: Use Redis Cloud connection string

### JWT Configuration
- `JWT_SECRET` - Secret key for access token signing
- `JWT_REFRESH_SECRET` - Secret key for refresh token signing
- `JWT_ACCESS_TOKEN_EXPIRES_IN` - Access token expiry (default: 15m)
- `JWT_REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiry (default: 7d)

### Cloudinary Configuration
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Razorpay Configuration
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret

### Email Configuration (SMTP)
- `SMTP_HOST` - SMTP server host (e.g., smtp.gmail.com)
- `SMTP_PORT` - SMTP server port (e.g., 587)
- `SMTP_USER` - SMTP authentication email
- `SMTP_PASSWORD` - SMTP authentication password (use app password for Gmail)
- `EMAIL_FROM` - From email address for outgoing emails

### Logging Configuration
- `LOG_LEVEL` - Logging level (info, warn, error, debug)

### Cookie Configuration
- `COOKIE_DOMAIN` - Domain for cookies (optional)

### Rate Limiting Configuration
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

## Frontend Environment Variables

### API Configuration
- `VITE_API_URL` - Backend API base URL
  - Development: `http://localhost:5000/api/v1`
  - Production: Your deployed backend URL

### Razorpay Configuration
- `VITE_RAZORPAY_KEY_ID` - Razorpay public key ID (frontend-safe)

## Security Notes

### Never Commit .env Files
- Backend `.env` is in `.gitignore`
- Frontend `.env` is in `.gitignore`
- Use `.env.example` files as templates

### Production Best Practices
1. Use strong, randomly generated secrets for JWT
2. Use MongoDB Atlas for production database
3. Use Redis Cloud for production caching
4. Enable HTTPS in production
5. Use environment-specific configurations
6. Rotate secrets regularly
7. Use app-specific passwords for email services

### Getting Credentials

#### Cloudinary
1. Sign up at cloudinary.com
2. Navigate to Dashboard
3. Copy Cloud Name, API Key, and API Secret

#### Razorpay
1. Sign up at razorpay.com
2. Navigate to Settings > API Keys
3. Copy Key ID and Key Secret
4. Use Key ID in frontend (public)
5. Use Key Secret in backend (private)

#### SMTP (Gmail)
1. Enable 2-factor authentication
2. Generate app password
3. Use app password as SMTP_PASSWORD

#### MongoDB Atlas
1. Create free cluster at mongodb.com
2. Whitelist IP addresses
3. Copy connection string
4. Replace `<password>` with actual password

#### Redis Cloud
1. Create free account at redis.com
2. Create database
3. Copy connection string

## Example .env Files

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/shoppilot
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwxyz123456

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@shoppilot.ai

LOG_LEVEL=info

COOKIE_DOMAIN=

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890
```

## Deployment Platforms

### Vercel
- Add environment variables in project settings
- Use Vercel CLI: `vercel env add`

### Render
- Add environment variables in dashboard
- Use Render CLI: `render env set`

### Railway
- Add environment variables in dashboard
- Use Railway CLI: `railway variables set`

## Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running locally
- Verify connection string format
- Check IP whitelist for MongoDB Atlas

### Redis Connection Issues
- Check if Redis is running locally
- Verify connection string format
- Check firewall settings

### Email Sending Issues
- Verify SMTP credentials
- Check if app password is correct (Gmail)
- Test SMTP connection with tools like telnet

### Cloudinary Upload Issues
- Verify API credentials
- Check if folder exists or can be created
- Check file size limits

### Razorpay Integration Issues
- Verify key ID and secret
- Check if test mode is enabled
- Verify callback URLs
