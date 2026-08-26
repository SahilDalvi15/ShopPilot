<div align="center">
  <img src="https://img.icons8.com/color/150/000000/shopping-cart--v1.png" alt="ShopPilot Logo" width="100"/>
  <h1>🛍️ ShopPilot - The Ultimate Full-Stack E-Commerce Platform</h1>

  <p>
    <strong>A modern, high-performance, and scalable e-commerce solution with Web, Mobile, and Backend seamlessly integrated.</strong>
  </p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  </p>
</div>

<br />

## 🌟 About ShopPilot

**ShopPilot** is a complete end-to-end e-commerce platform built to support both buyers and sellers. It features a stunning **Web Application**, a cross-platform **Mobile Application**, and a robust **Node.js/Express Backend** powered by MongoDB. 

With dedicated Vendor Dashboards, Admin Panels, secure authentication, and a dynamic catalog system, ShopPilot brings a modern shopping experience to life.

---

## ✨ Key Features

### 💻 Web Application (React & Vite)
- **Beautiful UI/UX:** Built with Tailwind CSS and Framer Motion for smooth animations.
- **Admin & Vendor Dashboards:** Dedicated panels to manage products, view sales, and handle orders.
- **Advanced Filtering & Search:** Find products instantly with multi-faceted filtering.
- **Shopping Cart & Checkout:** Seamless Cart management and secure Cash on Delivery (COD) processing.
- **Loyalty Program:** Earn points and level up!

### 📱 Mobile Application (Expo & React Native)
- **Cross-Platform:** Runs flawlessly on both iOS and Android.
- **Native Experience:** Built with React Native New Architecture (Fabric) and Expo SDK 57.
- **Guest Browsing:** Start shopping immediately without forced logins.
- **Wishlist & Cart Management:** Add items to cart/wishlist on the go.
- **Order Tracking:** Track your order history from anywhere.

### ⚙️ Backend API (Node.js & Express)
- **Secure Authentication:** JWT-based access with refresh tokens and role-based access control.
- **Scalable Architecture:** Designed for heavy traffic using MongoDB and Redis caching.
- **Image Management:** Cloudinary integration for lightning-fast image delivery.
- **Advanced Validations:** Joi-powered input validation.

---

## 🛠️ Technology Stack

| Domain | Technologies |
| --- | --- |
| **Frontend Web** | React 18, Vite, React Router, Redux Toolkit, TailwindCSS, Lucide Icons |
| **Mobile App** | React Native, Expo, Expo Router, Axios, SecureStore |
| **Backend API** | Node.js, Express.js, JWT, Joi, Cloudinary, Multer, Winston |
| **Database & Cache** | MongoDB, Mongoose, Redis |
| **Deployment** | Vercel (Web), Render/Railway (API), EAS Build (Mobile APK/IPA) |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Redis](https://redis.io/) (Optional but recommended)
- [Expo CLI](https://expo.dev/) (For mobile development)

### 1. Clone the Repository
```bash
git clone https://github.com/SahilDalvi15/ShopPilot.git
cd ShopPilot
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment template and fill in your credentials
cp .env.example .env

# Start the development server
npm run dev
```

### 3. Frontend Web Setup
```bash
# Open a new terminal
cd frontend
npm install

# Create .env and add: VITE_API_URL=http://localhost:5000/api/v1
npm run dev
```

### 4. Mobile App Setup
```bash
# Open a new terminal
cd mobile
npm install

# Create a local env file if needed or use expo directly
npx expo start
```
*Press `a` to open on an Android emulator or `i` for iOS simulator.*

---

## 🏗️ Project Architecture

```plaintext
ShopPilot/
├── backend/          # Node.js + Express API server
│   ├── src/models/   # MongoDB Schemas
│   ├── src/routes/   # API Endpoints
│   └── src/server.js # Entry point
├── frontend/         # React + Vite Web Application
│   ├── src/pages/    # Route components
│   └── src/store/    # Redux State Management
├── mobile/           # Expo React Native App
│   ├── app/          # Expo Router file-based navigation
│   └── components/   # Reusable UI components
└── README.md         # You are here!
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with ❤️ by Sahil Dalvi & The ShopPilot Team</b>
</div>