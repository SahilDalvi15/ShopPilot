# ShopPilot AI - API Contract Design

## API Overview

**Base URL**: `https://api.shoppilot.ai/v1`  
**Protocol**: HTTPS  
**Authentication**: JWT Bearer Token  
**Content-Type**: `application/json`  
**Response Format**: JSON

---

## Standard API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2026-06-14T18:30:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details",
    "stack": "Error stack trace (development only)"
  },
  "meta": {
    "timestamp": "2026-06-14T18:30:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2026-06-14T18:30:00.000Z",
    "requestId": "req_123456789"
  }
}
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

---

## Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Input validation failed |
| AUTHENTICATION_ERROR | Authentication failed |
| AUTHORIZATION_ERROR | Insufficient permissions |
| NOT_FOUND_ERROR | Resource not found |
| CONFLICT_ERROR | Resource conflict |
| BUSINESS_LOGIC_ERROR | Business rule violation |
| EXTERNAL_SERVICE_ERROR | Third-party service error |
| RATE_LIMIT_ERROR | Rate limit exceeded |
| INTERNAL_ERROR | Internal server error |

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+919876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isEmailVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isEmailVerified": true,
      "profilePicture": "https://res.cloudinary.com/..."
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### Logout User
**POST** `/auth/logout`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Refresh Token
**POST** `/auth/refresh-token`

**Headers:** `Authorization: Bearer {refreshToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Forgot Password
**POST** `/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Reset Password
**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token_here",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### Verify Email
**POST** `/auth/verify-email`

**Request Body:**
```json
{
  "token": "verification_token_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

## User Management Endpoints

### Get User Profile
**GET** `/users/profile`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+919876543210",
    "role": "customer",
    "profilePicture": "https://res.cloudinary.com/...",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "isEmailVerified": true,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### Update User Profile
**PUT** `/users/profile`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+919876543211",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phoneNumber": "+919876543211",
    "role": "customer",
    "profilePicture": "https://res.cloudinary.com/...",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "isEmailVerified": true
  }
}
```

---

### Upload Profile Picture
**POST** `/users/profile-picture`

**Headers:** `Authorization: Bearer {accessToken}`  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
profilePicture: [file]
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "data": {
    "profilePicture": "https://res.cloudinary.com/..."
  }
}
```

---

### Get User Addresses
**GET** `/users/addresses`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "id": "addr_123",
      "fullName": "John Doe",
      "phoneNumber": "+919876543210",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apt 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "postalCode": "400001",
      "addressType": "home",
      "isDefault": true
    }
  ]
}
```

---

### Add Address
**POST** `/users/addresses`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "+919876543210",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "postalCode": "400001",
  "addressType": "home",
  "isDefault": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "id": "addr_123",
    "fullName": "John Doe",
    "phoneNumber": "+919876543210",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "postalCode": "400001",
    "addressType": "home",
    "isDefault": false
  }
}
```

---

### Update Address
**PUT** `/users/addresses/:addressId`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "fullName": "John Smith",
  "phoneNumber": "+919876543211",
  "addressLine1": "456 New Street",
  "city": "Delhi",
  "state": "Delhi",
  "postalCode": "110001",
  "addressType": "office",
  "isDefault": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "id": "addr_123",
    "fullName": "John Smith",
    "phoneNumber": "+919876543211",
    "addressLine1": "456 New Street",
    "city": "Delhi",
    "state": "Delhi",
    "country": "India",
    "postalCode": "110001",
    "addressType": "office",
    "isDefault": true
  }
}
```

---

### Delete Address
**DELETE** `/users/addresses/:addressId`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

### Set Default Address
**PUT** `/users/addresses/:addressId/default`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Default address set successfully"
}
```

---

## Product Management Endpoints

### Get Products (Public)
**GET** `/products`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10, max: 50)
- `category` (category ID)
- `brand` (brand ID)
- `search` (search query)
- `minPrice` (minimum price)
- `maxPrice` (maximum price)
- `sortBy` (price, rating, newest, popularity)
- `sortOrder` (asc, desc)

**Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "prod_123",
      "title": "Product Name",
      "slug": "product-name",
      "description": "Product description",
      "shortDescription": "Short description",
      "brand": {
        "id": "brand_123",
        "name": "Brand Name",
        "slug": "brand-name"
      },
      "category": {
        "id": "cat_123",
        "name": "Category Name",
        "slug": "category-name"
      },
      "images": [
        "https://res.cloudinary.com/..."
      ],
      "price": 999,
      "discount": 10,
      "discountedPrice": 899,
      "currency": "INR",
      "stock": 50,
      "rating": 4.5,
      "reviewCount": 100,
      "soldCount": 500,
      "isFeatured": false,
      "specifications": {
        "color": "Black",
        "size": "M"
      },
      "tags": ["tag1", "tag2"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Get Product Details (Public)
**GET** `/products/:slug`

**Response (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "prod_123",
    "title": "Product Name",
    "slug": "product-name",
    "description": "Full product description",
    "shortDescription": "Short description",
    "brand": {
      "id": "brand_123",
      "name": "Brand Name",
      "slug": "brand-name",
      "logo": "https://res.cloudinary.com/..."
    },
    "category": {
      "id": "cat_123",
      "name": "Category Name",
      "slug": "category-name",
      "image": "https://res.cloudinary.com/..."
    },
    "images": [
      "https://res.cloudinary.com/..."
    ],
    "price": 999,
    "discount": 10,
    "discountedPrice": 899,
    "currency": "INR",
    "stock": 50,
    "rating": 4.5,
    "reviewCount": 100,
    "soldCount": 500,
    "viewCount": 1000,
    "isFeatured": false,
    "specifications": {
      "color": "Black",
      "size": "M",
      "material": "Cotton",
      "weight": 500,
      "dimensions": "10x5x2",
      "warranty": "1 year"
    },
    "tags": ["tag1", "tag2"],
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### Create Product (Admin)
**POST** `/products`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "title": "Product Name",
  "description": "Product description",
  "shortDescription": "Short description",
  "brandId": "brand_123",
  "categoryId": "cat_123",
  "images": ["https://res.cloudinary.com/..."],
  "price": 999,
  "discount": 10,
  "stock": 50,
  "specifications": {
    "color": "Black",
    "size": "M"
  },
  "tags": ["tag1", "tag2"],
  "isFeatured": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "prod_123",
    "title": "Product Name",
    "slug": "product-name",
    "description": "Product description",
    "shortDescription": "Short description",
    "brandId": "brand_123",
    "categoryId": "cat_123",
    "images": ["https://res.cloudinary.com/..."],
    "price": 999,
    "discount": 10,
    "discountedPrice": 899,
    "stock": 50,
    "rating": 0,
    "reviewCount": 0,
    "soldCount": 0,
    "isFeatured": false,
    "specifications": {
      "color": "Black",
      "size": "M"
    },
    "tags": ["tag1", "tag2"],
    "isActive": true
  }
}
```

---

### Update Product (Admin)
**PUT** `/products/:productId`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "title": "Updated Product Name",
  "description": "Updated description",
  "price": 1099,
  "discount": 15,
  "stock": 100
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "prod_123",
    "title": "Updated Product Name",
    "slug": "product-name",
    "description": "Updated description",
    "price": 1099,
    "discount": 15,
    "discountedPrice": 934,
    "stock": 100
  }
}
```

---

### Delete Product (Admin)
**DELETE** `/products/:productId`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Category Endpoints

### Get Categories (Public)
**GET** `/categories`

**Query Parameters:**
- `parentId` (parent category ID)
- `level` (category level)

**Response (200):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "cat_123",
      "name": "Category Name",
      "slug": "category-name",
      "description": "Category description",
      "parentId": null,
      "level": 0,
      "image": "https://res.cloudinary.com/...",
      "icon": "https://res.cloudinary.com/...",
      "isActive": true
    }
  ]
}
```

---

### Create Category (Admin)
**POST** `/categories`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "name": "Category Name",
  "description": "Category description",
  "parentId": null,
  "image": "https://res.cloudinary.com/...",
  "icon": "https://res.cloudinary.com/..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "cat_123",
    "name": "Category Name",
    "slug": "category-name",
    "description": "Category description",
    "parentId": null,
    "level": 0,
    "image": "https://res.cloudinary.com/...",
    "icon": "https://res.cloudinary.com/...",
    "isActive": true
  }
}
```

---

### Update Category (Admin)
**PUT** `/categories/:categoryId`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "cat_123",
    "name": "Updated Category Name",
    "slug": "category-name",
    "description": "Updated description"
  }
}
```

---

### Delete Category (Admin)
**DELETE** `/categories/:categoryId`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## Brand Endpoints

### Get Brands (Public)
**GET** `/brands`

**Response (200):**
```json
{
  "success": true,
  "message": "Brands retrieved successfully",
  "data": [
    {
      "id": "brand_123",
      "name": "Brand Name",
      "slug": "brand-name",
      "description": "Brand description",
      "logo": "https://res.cloudinary.com/...",
      "website": "https://brand.com",
      "isActive": true
    }
  ]
}
```

---

### Create Brand (Admin)
**POST** `/brands`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "name": "Brand Name",
  "description": "Brand description",
  "logo": "https://res.cloudinary.com/...",
  "website": "https://brand.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Brand created successfully",
  "data": {
    "id": "brand_123",
    "name": "Brand Name",
    "slug": "brand-name",
    "description": "Brand description",
    "logo": "https://res.cloudinary.com/...",
    "website": "https://brand.com",
    "isActive": true
  }
}
```

---

### Update Brand (Admin)
**PUT** `/brands/:brandId`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "name": "Updated Brand Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Brand updated successfully",
  "data": {
    "id": "brand_123",
    "name": "Updated Brand Name",
    "slug": "brand-name",
    "description": "Updated description"
  }
}
```

---

### Delete Brand (Admin)
**DELETE** `/brands/:brandId`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Brand deleted successfully"
}
```

---

## Cart Endpoints

### Get Cart
**GET** `/cart`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": "cart_123",
    "userId": "user_123",
    "items": [
      {
        "productId": "prod_123",
        "product": {
          "id": "prod_123",
          "title": "Product Name",
          "slug": "product-name",
          "images": ["https://res.cloudinary.com/..."],
          "price": 999,
          "discount": 10,
          "discountedPrice": 899,
          "stock": 50
        },
        "quantity": 2,
        "price": 999,
        "discountedPrice": 899,
        "subtotal": 1798
      }
    ],
    "appliedCoupon": null,
    "subtotal": 1798,
    "totalDiscount": 200,
    "totalAmount": 1598
  }
}
```

---

### Add to Cart
**POST** `/cart/items`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "productId": "prod_123",
  "quantity": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "item": {
      "productId": "prod_123",
      "quantity": 2,
      "price": 999,
      "discountedPrice": 899,
      "subtotal": 1798
    },
    "cart": {
      "subtotal": 1798,
      "totalDiscount": 0,
      "totalAmount": 1798
    }
  }
}
```

---

### Update Cart Item
**PUT** `/cart/items/:productId`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "item": {
      "productId": "prod_123",
      "quantity": 3,
      "price": 999,
      "discountedPrice": 899,
      "subtotal": 2697
    },
    "cart": {
      "subtotal": 2697,
      "totalDiscount": 0,
      "totalAmount": 2697
    }
  }
}
```

---

### Remove from Cart
**DELETE** `/cart/items/:productId`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": {
    "subtotal": 0,
    "totalDiscount": 0,
    "totalAmount": 0
  }
}
```

---

### Clear Cart
**DELETE** `/cart`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

### Apply Coupon
**POST** `/cart/coupon`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "code": "WELCOME10"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "appliedCoupon": {
      "couponId": "coupon_123",
      "code": "WELCOME10",
      "discountAmount": 180
    },
    "cart": {
      "subtotal": 1798,
      "totalDiscount": 180,
      "totalAmount": 1618
    }
  }
}
```

---

### Remove Coupon
**DELETE** `/cart/coupon`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Coupon removed successfully",
  "data": {
    "subtotal": 1798,
    "totalDiscount": 0,
    "totalAmount": 1798
  }
}
```

---

## Wishlist Endpoints

### Get Wishlist
**GET** `/wishlist`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Wishlist retrieved successfully",
  "data": {
    "id": "wishlist_123",
    "userId": "user_123",
    "items": [
      {
        "productId": "prod_123",
        "product": {
          "id": "prod_123",
          "title": "Product Name",
          "slug": "product-name",
          "images": ["https://res.cloudinary.com/..."],
          "price": 999,
          "discount": 10,
          "discountedPrice": 899,
          "stock": 50,
          "rating": 4.5
        },
        "addedAt": "2026-06-14T18:30:00.000Z"
      }
    ]
  }
}
```

---

### Add to Wishlist
**POST** `/wishlist/items`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "productId": "prod_123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Item added to wishlist successfully",
  "data": {
    "productId": "prod_123",
    "addedAt": "2026-06-14T18:30:00.000Z"
  }
}
```

---

### Remove from Wishlist
**DELETE** `/wishlist/items/:productId`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from wishlist successfully"
}
```

---

### Move to Cart
**POST** `/wishlist/items/:productId/move-to-cart`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Item moved to cart successfully",
  "data": {
    "cartItem": {
      "productId": "prod_123",
      "quantity": 1,
      "price": 999,
      "discountedPrice": 899
    }
  }
}
```

---

## Order Endpoints

### Create Order
**POST** `/orders`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "shippingAddressId": "addr_123",
  "billingAddressId": "addr_123",
  "paymentMethod": "razorpay",
  "couponCode": "WELCOME10"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "order_123",
      "orderNumber": "ORD20260614001",
      "userId": "user_123",
      "items": [
        {
          "id": "orderItem_123",
          "productId": "prod_123",
          "productTitle": "Product Name",
          "productImage": "https://res.cloudinary.com/...",
          "quantity": 2,
          "price": 999,
          "discountedPrice": 899,
          "subtotal": 1798
        }
      ],
      "shippingAddress": {
        "fullName": "John Doe",
        "phoneNumber": "+919876543210",
        "addressLine1": "123 Main Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001"
      },
      "billingAddress": {
        "fullName": "John Doe",
        "phoneNumber": "+919876543210",
        "addressLine1": "123 Main Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001"
      },
      "subtotal": 1798,
      "discount": 180,
      "shippingCharge": 0,
      "tax": 0,
      "totalAmount": 1618,
      "paymentMethod": "razorpay",
      "paymentStatus": "pending",
      "orderStatus": "pending",
      "estimatedDelivery": "2026-06-21T00:00:00.000Z"
    },
    "razorpayOrder": {
      "id": "razorpay_order_123",
      "amount": 161800,
      "currency": "INR"
    }
  }
}
```

---

### Get Orders
**GET** `/orders`

**Headers:** `Authorization: Bearer {accessToken}`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` (order status filter)

**Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": "order_123",
      "orderNumber": "ORD20260614001",
      "items": [
        {
          "productId": "prod_123",
          "productTitle": "Product Name",
          "productImage": "https://res.cloudinary.com/...",
          "quantity": 2,
          "subtotal": 1798
        }
      ],
      "totalAmount": 1618,
      "paymentStatus": "success",
      "orderStatus": "confirmed",
      "createdAt": "2026-06-14T18:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### Get Order Details
**GET** `/orders/:orderId`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": "order_123",
    "orderNumber": "ORD20260614001",
    "userId": "user_123",
    "items": [
      {
        "id": "orderItem_123",
        "productId": "prod_123",
        "productTitle": "Product Name",
        "productImage": "https://res.cloudinary.com/...",
        "brand": "Brand Name",
        "category": "Category Name",
        "quantity": 2,
        "price": 999,
        "discountedPrice": 899,
        "discount": 10,
        "subtotal": 1798,
        "specifications": {
          "color": "Black",
          "size": "M"
        },
        "isReturned": false
      }
    ],
    "shippingAddress": {
      "fullName": "John Doe",
      "phoneNumber": "+919876543210",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apt 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "postalCode": "400001"
    },
    "billingAddress": {
      "fullName": "John Doe",
      "phoneNumber": "+919876543210",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apt 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "postalCode": "400001"
    },
    "subtotal": 1798,
    "discount": 180,
    "shippingCharge": 0,
    "tax": 0,
    "totalAmount": 1618,
    "paymentMethod": "razorpay",
    "paymentStatus": "success",
    "paymentId": "payment_123",
    "orderStatus": "confirmed",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2026-06-14T18:30:00.000Z",
        "note": "Order placed"
      },
      {
        "status": "confirmed",
        "timestamp": "2026-06-14T18:35:00.000Z",
        "note": "Payment verified"
      }
    ],
    "coupon": {
      "couponId": "coupon_123",
      "code": "WELCOME10",
      "discountAmount": 180
    },
    "estimatedDelivery": "2026-06-21T00:00:00.000Z",
    "createdAt": "2026-06-14T18:30:00.000Z",
    "updatedAt": "2026-06-14T18:35:00.000Z"
  }
}
```

---

### Cancel Order
**POST** `/orders/:orderId/cancel`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "reason": "Changed mind"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "orderStatus": "cancelled",
    "cancellationReason": "Changed mind"
  }
}
```

---

## Payment Endpoints

### Create Razorpay Order
**POST** `/payments/create-order`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "amount": 1618,
  "currency": "INR",
  "orderId": "order_123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "razorpayOrderId": "razorpay_order_123",
    "amount": 161800,
    "currency": "INR",
    "key": "rzp_test_123456"
  }
}
```

---

### Verify Payment
**POST** `/payments/verify`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "razorpayOrderId": "razorpay_order_123",
  "razorpayPaymentId": "razorpay_payment_123",
  "razorpaySignature": "signature_here",
  "orderId": "order_123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment": {
      "id": "payment_123",
      "orderId": "order_123",
      "razorpayOrderId": "razorpay_order_123",
      "razorpayPaymentId": "razorpay_payment_123",
      "amount": 1618,
      "currency": "INR",
      "status": "success",
      "paymentDate": "2026-06-14T18:35:00.000Z"
    },
    "order": {
      "id": "order_123",
      "orderStatus": "confirmed",
      "paymentStatus": "success"
    }
  }
}
```

---

### Payment Webhook
**POST** `/payments/webhook`

**Headers:** `X-Razorpay-Signature: {signature}`

**Request Body:** Razorpay webhook payload

**Response (200):**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

---

## Review Endpoints

### Get Product Reviews (Public)
**GET** `/products/:productId/reviews`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `rating` (filter by rating)

**Response (200):**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": [
    {
      "id": "review_123",
      "productId": "prod_123",
      "userId": "user_123",
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "https://res.cloudinary.com/..."
      },
      "rating": 5,
      "title": "Great product",
      "comment": "Excellent quality and fast delivery",
      "images": ["https://res.cloudinary.com/..."],
      "isVerifiedPurchase": true,
      "helpfulCount": 10,
      "notHelpfulCount": 2,
      "createdAt": "2026-06-14T18:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Add Review
**POST** `/products/:productId/reviews`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "rating": 5,
  "title": "Great product",
  "comment": "Excellent quality and fast delivery",
  "orderId": "order_123",
  "images": ["https://res.cloudinary.com/..."]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Review added successfully",
  "data": {
    "id": "review_123",
    "productId": "prod_123",
    "userId": "user_123",
    "rating": 5,
    "title": "Great product",
    "comment": "Excellent quality and fast delivery",
    "images": ["https://res.cloudinary.com/..."],
    "isVerifiedPurchase": true,
    "isApproved": true,
    "createdAt": "2026-06-14T18:30:00.000Z"
  }
}
```

---

### Update Review
**PUT** `/reviews/:reviewId`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "rating": 4,
  "title": "Good product",
  "comment": "Updated review text"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "id": "review_123",
    "rating": 4,
    "title": "Good product",
    "comment": "Updated review text",
    "updatedAt": "2026-06-14T18:35:00.000Z"
  }
}
```

---

### Delete Review
**DELETE** `/reviews/:reviewId`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

### Mark Review Helpful
**POST** `/reviews/:reviewId/helpful`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Review marked as helpful",
  "data": {
    "helpfulCount": 11
  }
}
```

---

## Coupon Endpoints

### Get Coupons (Public)
**GET** `/coupons`

**Query Parameters:**
- `active` (filter active coupons only)

**Response (200):**
```json
{
  "success": true,
  "message": "Coupons retrieved successfully",
  "data": [
    {
      "id": "coupon_123",
      "code": "WELCOME10",
      "description": "10% off on first order",
      "discountType": "percentage",
      "discountValue": 10,
      "maxDiscountAmount": 500,
      "minOrderAmount": 500,
      "validFrom": "2026-01-01T00:00:00.000Z",
      "validUntil": "2026-12-31T23:59:59.000Z",
      "isActive": true
    }
  ]
}
```

---

### Validate Coupon
**POST** `/coupons/validate`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "code": "WELCOME10",
  "cartTotal": 1798
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Coupon is valid",
  "data": {
    "couponId": "coupon_123",
    "code": "WELCOME10",
    "discountType": "percentage",
    "discountValue": 10,
    "discountAmount": 180,
    "maxDiscountAmount": 500,
    "minOrderAmount": 500
  }
}
```

---

### Create Coupon (Admin)
**POST** `/coupons`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "code": "SUMMER2026",
  "description": "Summer sale discount",
  "discountType": "percentage",
  "discountValue": 20,
  "maxDiscountAmount": 1000,
  "minOrderAmount": 1000,
  "usageLimit": 1000,
  "usageLimitPerUser": 2,
  "validFrom": "2026-06-01T00:00:00.000Z",
  "validUntil": "2026-08-31T23:59:59.000Z",
  "applicableCategories": ["cat_123"],
  "applicableBrands": ["brand_123"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "id": "coupon_123",
    "code": "SUMMER2026",
    "description": "Summer sale discount",
    "discountType": "percentage",
    "discountValue": 20,
    "maxDiscountAmount": 1000,
    "minOrderAmount": 1000,
    "usageLimit": 1000,
    "usageLimitPerUser": 2,
    "usedCount": 0,
    "validFrom": "2026-06-01T00:00:00.000Z",
    "validUntil": "2026-08-31T23:59:59.000Z",
    "isActive": true
  }
}
```

---

### Update Coupon (Admin)
**PUT** `/coupons/:couponId`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "discountValue": 25,
  "usageLimit": 2000
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Coupon updated successfully",
  "data": {
    "id": "coupon_123",
    "discountValue": 25,
    "usageLimit": 2000
  }
}
```

---

### Delete Coupon (Admin)
**DELETE** `/coupons/:couponId`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

---

## Notification Endpoints

### Get Notifications
**GET** `/notifications`

**Headers:** `Authorization: Bearer {accessToken}`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `unread` (filter unread only)

**Response (200):**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": [
    {
      "id": "notif_123",
      "userId": "user_123",
      "type": "order",
      "title": "Order Confirmed",
      "message": "Your order ORD20260614001 has been confirmed",
      "data": {
        "orderId": "order_123",
        "orderNumber": "ORD20260614001"
      },
      "isRead": false,
      "actionUrl": "/orders/order_123",
      "priority": "high",
      "createdAt": "2026-06-14T18:35:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Mark Notification as Read
**PUT** `/notifications/:notificationId/read`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "isRead": true,
    "readAt": "2026-06-14T18:40:00.000Z"
  }
}
```

---

### Mark All Notifications as Read
**PUT** `/notifications/read-all`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### Delete Notification
**DELETE** `/notifications/:notificationId`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## Admin Endpoints

### Get Dashboard Stats
**GET** `/admin/dashboard/stats`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalUsers": 10000,
    "totalOrders": 5000,
    "totalRevenue": 5000000,
    "totalProducts": 1000,
    "activeUsers": 2500,
    "pendingOrders": 50,
    "lowStockProducts": 20,
    "todayOrders": 100,
    "todayRevenue": 100000,
    "monthlyRevenue": 3000000,
    "yearlyRevenue": 50000000
  }
}
```

---

### Get Users (Admin)
**GET** `/admin/users`

**Headers:** `Authorization: Bearer {accessToken}`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `search` (search by email or name)
- `role` (filter by role)
- `status` (filter by active status)

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+919876543210",
      "role": "customer",
      "isEmailVerified": true,
      "isActive": true,
      "lastLogin": "2026-06-14T18:30:00.000Z",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Update User Role (Admin)
**PUT** `/admin/users/:userId/role`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": "user_123",
    "role": "admin"
  }
}
```

---

### Deactivate User (Admin)
**PUT** `/admin/users/:userId/deactivate`

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "id": "user_123",
    "isActive": false
  }
}
```

---

### Get All Orders (Admin)
**GET** `/admin/orders`

**Headers:** `Authorization: Bearer {accessToken}`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` (filter by order status)
- `paymentStatus` (filter by payment status)
- `dateFrom` (filter by date range)
- `dateTo` (filter by date range)

**Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": "order_123",
      "orderNumber": "ORD20260614001",
      "userId": "user_123",
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
      },
      "items": [
        {
          "productId": "prod_123",
          "productTitle": "Product Name",
          "quantity": 2,
          "subtotal": 1798
        }
      ],
      "totalAmount": 1618,
      "paymentStatus": "success",
      "orderStatus": "confirmed",
      "createdAt": "2026-06-14T18:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 500,
    "totalPages": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Update Order Status (Admin)
**PUT** `/admin/orders/:orderId/status`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "status": "shipped",
  "note": "Order shipped via BlueDart"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "orderStatus": "shipped",
    "statusHistory": [
      {
        "status": "shipped",
        "timestamp": "2026-06-15T10:00:00.000Z",
        "note": "Order shipped via BlueDart",
        "updatedBy": "admin_123"
      }
    ]
  }
}
```

---

### Get Inventory (Admin)
**GET** `/admin/inventory`

**Headers:** `Authorization: Bearer {accessToken}`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `lowStock` (filter low stock items)
- `outOfStock` (filter out of stock items)

**Response (200):**
```json
{
  "success": true,
  "message": "Inventory retrieved successfully",
  "data": [
    {
      "id": "inv_123",
      "productId": "prod_123",
      "product": {
        "title": "Product Name",
        "slug": "product-name"
      },
      "currentStock": 50,
      "reservedStock": 10,
      "availableStock": 40,
      "lowStockThreshold": 10,
      "outOfStockThreshold": 0,
      "lastRestockDate": "2026-06-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Update Inventory (Admin)
**PUT** `/admin/inventory/:inventoryId`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "currentStock": 100,
  "changeType": "restock",
  "reason": "New stock received",
  "quantityChanged": 50
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Inventory updated successfully",
  "data": {
    "currentStock": 100,
    "availableStock": 90,
    "lastStockUpdate": "2026-06-14T18:30:00.000Z"
  }
}
```

---

### Get Refunds (Admin)
**GET** `/admin/refunds`

**Headers:** `Authorization: Bearer {accessToken}`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` (filter by refund status)

**Response (200):**
```json
{
  "success": true,
  "message": "Refunds retrieved successfully",
  "data": [
    {
      "id": "refund_123",
      "orderId": "order_123",
      "orderNumber": "ORD20260614001",
      "userId": "user_123",
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
      },
      "refundAmount": 1618,
      "refundReason": "Product damaged",
      "refundType": "full",
      "status": "pending",
      "createdAt": "2026-06-14T18:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Process Refund (Admin)
**PUT** `/admin/refunds/:refundId/process`

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "action": "approve",
  "reason": "Refund approved for damaged product"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "status": "approved",
    "approvedBy": "admin_123",
    "approvedAt": "2026-06-14T18:35:00.000Z"
  }
}
```

---

## Rate Limiting

**Default Limits:**
- Unauthenticated requests: 100 requests per 15 minutes
- Authenticated requests: 1000 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes per IP

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1623672000
```

---

## API Versioning

**Current Version:** v1  
**Version Strategy:** URL-based versioning  
**Deprecation Policy:** 6 months notice before deprecation

---

## Webhooks

### Payment Webhook
**Endpoint:** `POST /payments/webhook`  
**Events:** payment.captured, payment.failed, refund.processed

### Order Webhook (Future)
**Endpoint:** `POST /webhooks/orders`  
**Events:** order.created, order.updated, order.cancelled

---

## API Documentation

**Swagger/OpenAPI:** Available at `/api-docs`  
**Postman Collection:** Available in repository  
**API Testing:** Use provided Postman collection

---

## Conclusion

This API contract provides:
- **Comprehensive Coverage**: All e-commerce operations
- **RESTful Design**: Standard HTTP methods and status codes
- **Consistent Responses**: Standardized response format
- **Security**: JWT authentication, rate limiting
- **Pagination**: All list endpoints support pagination
- **Error Handling**: Detailed error responses
- **Documentation**: Clear request/response examples
- **Future-Ready**: Designed for AI integration
