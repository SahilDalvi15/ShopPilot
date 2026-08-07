# ShopPilot AI - Folder Structure Design

## Project Root Structure

```
ShopPilot/
├── backend/
├── frontend/
├── docs/
├── docker/
├── .gitignore
├── docker-compose.yml
├── README.md
└── ProjectPrd.md
```

---

## Backend Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.config.js
│   │   ├── redis.config.js
│   │   ├── cloudinary.config.js
│   │   ├── razorpay.config.js
│   │   └── index.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── brand.controller.js
│   │   ├── inventory.controller.js
│   │   ├── cart.controller.js
│   │   ├── wishlist.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   ├── review.controller.js
│   │   ├── coupon.controller.js
│   │   ├── notification.controller.js
│   │   └── admin.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   ├── category.service.js
│   │   ├── brand.service.js
│   │   ├── inventory.service.js
│   │   ├── cart.service.js
│   │   ├── wishlist.service.js
│   │   ├── order.service.js
│   │   ├── payment.service.js
│   │   ├── review.service.js
│   │   ├── coupon.service.js
│   │   ├── notification.service.js
│   │   └── admin.service.js
│   │
│   ├── repositories/
│   │   ├── user.repository.js
│   │   ├── address.repository.js
│   │   ├── product.repository.js
│   │   ├── category.repository.js
│   │   ├── brand.repository.js
│   │   ├── inventory.repository.js
│   │   ├── inventoryLog.repository.js
│   │   ├── cart.repository.js
│   │   ├── wishlist.repository.js
│   │   ├── order.repository.js
│   │   ├── orderItem.repository.js
│   │   ├── payment.repository.js
│   │   ├── refund.repository.js
│   │   ├── review.repository.js
│   │   ├── coupon.repository.js
│   │   ├── notification.repository.js
│   │   └── auditLog.repository.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── brand.routes.js
│   │   ├── inventory.routes.js
│   │   ├── cart.routes.js
│   │   ├── wishlist.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   ├── review.routes.js
│   │   ├── coupon.routes.js
│   │   ├── notification.routes.js
│   │   └── admin.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── cache.middleware.js
│   │   └── logger.middleware.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── product.validator.js
│   │   ├── category.validator.js
│   │   ├── brand.validator.js
│   │   ├── inventory.validator.js
│   │   ├── cart.validator.js
│   │   ├── wishlist.validator.js
│   │   ├── order.validator.js
│   │   ├── payment.validator.js
│   │   ├── review.validator.js
│   │   ├── coupon.validator.js
│   │   └── notification.validator.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── address.model.js
│   │   ├── category.model.js
│   │   ├── brand.model.js
│   │   ├── product.model.js
│   │   ├── inventory.model.js
│   │   ├── inventoryLog.model.js
│   │   ├── cart.model.js
│   │   ├── wishlist.model.js
│   │   ├── order.model.js
│   │   ├── orderItem.model.js
│   │   ├── payment.model.js
│   │   ├── refund.model.js
│   │   ├── review.model.js
│   │   ├── coupon.model.js
│   │   ├── notification.model.js
│   │   └── auditLog.model.js
│   │
│   ├── utils/
│   │   ├── response.util.js
│   │   ├── error.util.js
│   │   ├── jwt.util.js
│   │   ├── bcrypt.util.js
│   │   ├── email.util.js
│   │   ├── cloudinary.util.js
│   │   ├── razorpay.util.js
│   │   ├── cache.util.js
│   │   ├── pagination.util.js
│   │   ├── slug.util.js
│   │   └── validator.util.js
│   │
│   ├── jobs/
│   │   ├── orderStatus.job.js
│   │   ├── couponExpiry.job.js
│   │   ├── notificationCleanup.job.js
│   │   └── index.js
│   │
│   ├── constants/
│   │   ├── role.constants.js
│   │   ├── orderStatus.constants.js
│   │   ├── paymentStatus.constants.js
│   │   ├── errorCodes.constants.js
│   │   ├── cacheKeys.constants.js
│   │   └── index.js
│   │
│   ├── docs/
│   │   └── api.swagger.json
│   │
│   ├── sockets/
│   │   ├── order.socket.js
│   │   ├── notification.socket.js
│   │   └── index.js
│   │
│   ├── uploads/
│   │   └── temp/
│   │
│   └── app.js
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth/
│   │   ├── products/
│   │   └── orders/
│   └── setup.js
│
├── .env.example
├── .env.development
├── .env.production
├── .gitignore
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
└── README.md
```

---

## Frontend Folder Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   │
│   │   ├── user/
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── AddressPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   │
│   │   ├── products/
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   └── CategoryPage.jsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartPage.jsx
│   │   │   └── CheckoutPage.jsx
│   │   │
│   │   ├── wishlist/
│   │   │   └── WishlistPage.jsx
│   │   │
│   │   ├── orders/
│   │   │   ├── OrderListPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   └── OrderTrackingPage.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminUsersPage.jsx
│   │   │   ├── AdminProductsPage.jsx
│   │   │   ├── AdminOrdersPage.jsx
│   │   │   ├── AdminInventoryPage.jsx
│   │   │   ├── AdminCouponsPage.jsx
│   │   │   └── AdminAnalyticsPage.jsx
│   │   │
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── TextArea.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Pagination.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Breadcrumb.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   └── ResetPasswordForm.jsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilter.jsx
│   │   │   ├── ProductSort.jsx
│   │   │   ├── ProductSearch.jsx
│   │   │   └── ProductImageGallery.jsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   ├── CouponInput.jsx
│   │   │   └── CartEmpty.jsx
│   │   │
│   │   ├── order/
│   │   │   ├── OrderCard.jsx
│   │   │   ├── OrderStatus.jsx
│   │   │   ├── OrderTimeline.jsx
│   │   │   └── OrderSummary.jsx
│   │   │
│   │   ├── review/
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   ├── ReviewList.jsx
│   │   │   └── RatingStars.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AdminStatsCard.jsx
│   │   │   ├── AdminTable.jsx
│   │   │   ├── AdminChart.jsx
│   │   │   └── AdminFilter.jsx
│   │   │
│   │   └── ui/
│   │       ├── Card.jsx
│   │       ├── Container.jsx
│   │       ├── Section.jsx
│   │       └── Divider.jsx
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── PublicLayout.jsx
│   │
│   ├── routes/
│   │   ├── index.jsx
│   │   ├── publicRoutes.jsx
│   │   ├── privateRoutes.jsx
│   │   └── adminRoutes.jsx
│   │
│   ├── store/
│   │   ├── index.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── userSlice.js
│   │   │   ├── cartSlice.js
│   │   │   ├── wishlistSlice.js
│   │   │   ├── productSlice.js
│   │   │   ├── orderSlice.js
│   │   │   └── uiSlice.js
│   │   └── middleware/
│   │       └── logger.js
│   │
│   ├── services/
│   │   ├── api.service.js
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   ├── wishlist.service.js
│   │   ├── order.service.js
│   │   ├── payment.service.js
│   │   ├── review.service.js
│   │   ├── coupon.service.js
│   │   ├── notification.service.js
│   │   └── admin.service.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useWishlist.js
│   │   ├── useProducts.js
│   │   ├── useOrders.js
│   │   ├── useDebounce.js
│   │   ├── usePagination.js
│   │   ├── useLocalStorage.js
│   │   └── useToast.js
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── utils/
│   │   ├── api.util.js
│   │   ├── format.util.js
│   │   ├── validation.util.js
│   │   ├── storage.util.js
│   │   ├── date.util.js
│   │   └── constants.js
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── logo.svg
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   ├── config/
│   │   ├── api.config.js
│   │   └── constants.js
│   │
│   ├── types/
│   │   ├── index.d.ts
│   │   ├── user.types.js
│   │   ├── product.types.js
│   │   ├── order.types.js
│   │   └── cart.types.js
│   │
│   └── App.jsx
│
├── public/
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   └── robots.txt
│
├── .env.example
├── .env.development
├── .env.production
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── Dockerfile
├── .dockerignore
└── README.md
```

---

## Docker Folder Structure

```
docker/
├── nginx/
│   ├── nginx.conf
│   └── ssl/
│
└── scripts/
    ├── setup.sh
    └── backup.sh
```

---

## Documentation Folder Structure

```
docs/
├── 01-architecture-analysis.md
├── 02-database-schema-design.md
├── 03-api-contract-design.md
├── 04-folder-structure.md
├── 05-validation-rules.md
├── 06-security-design.md
├── 07-deployment-guide.md
└── 08-api-documentation.md
```

---

## File Naming Conventions

### Backend
- Controllers: `*.controller.js`
- Services: `*.service.js`
- Repositories: `*.repository.js`
- Models: `*.model.js`
- Routes: `*.routes.js`
- Validators: `*.validator.js`
- Middlewares: `*.middleware.js`
- Utils: `*.util.js`
- Constants: `*.constants.js`
- Jobs: `*.job.js`

### Frontend
- Pages: `*Page.jsx`
- Components: `*.jsx` (PascalCase)
- Hooks: `use*.js`
- Services: `*.service.js`
- Utils: `*.util.js`
- Contexts: `*Context.jsx`
- Layouts: `*Layout.jsx`

---

## Import Conventions

### Backend
```javascript
// Absolute imports (recommended)
import UserService from '../services/user.service.js';
import UserRepository from '../repositories/user.repository.js';

// Relative imports
import { validateEmail } from '../utils/validator.util.js';
```

### Frontend
```javascript
// Absolute imports (recommended)
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

// Relative imports
import { formatPrice } from '../utils/format.util';
```

---

## Environment Variables

### Backend `.env`
```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/shoppilot
MONGODB_ATLAS_URI=mongodb+srv://...

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@shoppilot.ai

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=your_key_id
```

---

## Git Ignore Patterns

### Backend `.gitignore`
```
node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
dist/
uploads/temp/
.DS_Store
coverage/
.vscode/
.idea/
```

### Frontend `.gitignore`
```
node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
dist/
.DS_Store
coverage/
.vscode/
.idea/
```

---

## Package.json Dependencies

### Backend `package.json`
```json
{
  "name": "shoppilot-backend",
  "version": "1.0.0",
  "description": "ShopPilot AI Backend API",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "redis": "^4.6.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^7.0.0",
    "express-validator": "^7.0.0",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.40.0",
    "razorpay": "^2.8.0",
    "nodemailer": "^6.9.0",
    "node-cron": "^3.0.0",
    "socket.io": "^4.7.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.0",
    "eslint": "^8.50.0"
  }
}
```

### Frontend `package.json`
```json
{
  "name": "shoppilot-frontend",
  "version": "1.0.0",
  "description": "ShopPilot AI Frontend",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.300.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "razorpay": "^2.8.0",
    "react-hot-toast": "^2.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.50.0",
    "eslint-plugin-react": "^7.33.0"
  }
}
```

---

## Docker Compose Structure

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    depends_on:
      - mongodb
      - redis

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7.0-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

---

## Conclusion

This folder structure provides:
- **Clear Separation**: Backend and frontend completely separated
- **Modular Design**: Each module has its own folder
- **Scalability**: Easy to add new modules
- **Maintainability**: Clear file organization
- **Best Practices**: Industry-standard naming conventions
- **AI-Ready**: Structure supports future AI integration
