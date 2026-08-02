# ShopPilot

A modern, full-stack e-commerce application built with React, Node.js, Express, and MongoDB.

## Features

### Frontend
- **Modern UI/UX** - Built with React, TailwindCSS, and Lucide icons
- **User Authentication** - Login, registration, password reset
- **Product Management** - Browse, search, filter products
- **Shopping Cart** - Add to cart, quantity management
- **Wishlist** - Save favorite products
- **Checkout** - Razorpay payment integration
- **Order Management** - View order history and status
- **Address Management** - Multiple shipping/billing addresses
- **Product Reviews** - Rate and review products
- **Admin Dashboard** - Manage products, orders, and users
- **Toast Notifications** - Real-time feedback
- **Loading States** - Skeleton loaders for better UX
- **Error Boundaries** - Graceful error handling

### Backend
- **RESTful API** - Express.js with proper routing
- **Authentication** - JWT-based auth with refresh tokens
- **Authorization** - Role-based access control (user, admin, super_admin)
- **Input Validation** - Joi validation middleware
- **File Upload** - Cloudinary integration for image hosting
- **Email Service** - SMTP integration for notifications
- **Payment Integration** - Razorpay payment gateway
- **Caching** - Redis for session management
- **Logging** - Winston logger for structured logs
- **Security** - Helmet, CORS, rate limiting, XSS protection

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Redux Toolkit
- React Query
- TailwindCSS
- Lucide Icons
- Axios
- Razorpay SDK

### Backend
- Node.js
- Express.js
- MongoDB
- Redis
- JWT
- Joi
- Multer
- Cloudinary
- Nodemailer
- Winston
- Razorpay

## Project Structure

```
ShopPilot/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── validators/      # Joi validation schemas
│   ├── .env.example         # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   └── utils/           # Utility functions
│   └── package.json
├── docs/                    # Documentation
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Redis
- Cloudinary account
- Razorpay account
- SMTP service (e.g., Gmail, SendGrid)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SahilDalvi15/ShopPilot.git
cd ShopPilot
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
```

3. **Configure Backend Environment Variables**
Edit `backend/.env` with your credentials:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/shoppilot
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@shoppilot.ai
```

4. **Start Backend Server**
```bash
npm run dev
```

5. **Frontend Setup**
```bash
cd frontend
npm install
```

6. **Start Frontend Development Server**
```bash
npm run dev
```

7. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Environment Variables

### Backend
See `backend/.env.example` for all required environment variables.

### Frontend
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=your_key_id
```

## API Documentation

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:slug` - Get product by slug
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/:id` - Update product (admin)
- `DELETE /api/v1/products/:id` - Delete product (admin)

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order by ID
- `PUT /api/v1/orders/:id/cancel` - Cancel order

### Upload
- `POST /api/v1/upload/images` - Upload multiple images (admin)
- `POST /api/v1/upload/image` - Upload single image (admin)

## Deployment

### Backend Deployment (e.g., Render, Railway, Vercel)
1. Set environment variables in the deployment platform
2. Deploy MongoDB Atlas (if not using local)
3. Deploy Redis (e.g., Redis Cloud)
4. Push code to deployment platform

### Frontend Deployment (Vercel)
1. Build the frontend: `npm run build`
2. Deploy to Vercel
3. Set `VITE_API_URL` to production backend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.