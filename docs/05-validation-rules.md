# ShopPilot AI - Validation Rules Design

## Validation Overview

**Validation Library**: express-validator  
**Validation Strategy**: Schema-based validation at middleware layer  
**Validation Location**: Before controller execution  
**Error Handling**: Centralized error response format

---

## Validation Architecture

### Validation Flow
```
Request → Middleware → Validator Schema → Sanitization → Validation → Controller
```

### Validation Layers
1. **Request Validation**: Validate incoming request data
2. **Sanitization**: Clean and normalize input data
3. **Business Rule Validation**: Validate business logic in services
4. **Database Validation**: Schema-level validation in Mongoose

---

## Authentication Validation Rules

### Register Validator
```javascript
{
  email: {
    isEmail: true,
    normalizeEmail: true,
    trim: true,
    toLowerCase: true,
    notEmpty: true,
    errorMessage: 'Valid email is required'
  },
  password: {
    isLength: { min: 8, max: 128 },
    matches: {
      options: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ],
      errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    },
    notEmpty: true,
    errorMessage: 'Password is required'
  },
  firstName: {
    isLength: { min: 2, max: 50 },
    trim: true,
    escape: true,
    notEmpty: true,
    matches: {
      options: [/^[a-zA-Z\s]+$/],
      errorMessage: 'First name must contain only letters and spaces'
    },
    errorMessage: 'First name is required (2-50 characters)'
  },
  lastName: {
    isLength: { min: 2, max: 50 },
    trim: true,
    escape: true,
    notEmpty: true,
    matches: {
      options: [/^[a-zA-Z\s]+$/],
      errorMessage: 'Last name must contain only letters and spaces'
    },
    errorMessage: 'Last name is required (2-50 characters)'
  },
  phoneNumber: {
    optional: true,
    isMobilePhone: { options: ['en-IN'] },
    trim: true,
    errorMessage: 'Valid phone number is required'
  }
}
```

### Login Validator
```javascript
{
  email: {
    isEmail: true,
    normalizeEmail: true,
    trim: true,
    toLowerCase: true,
    notEmpty: true,
    errorMessage: 'Valid email is required'
  },
  password: {
    notEmpty: true,
    errorMessage: 'Password is required'
  }
}
```

### Forgot Password Validator
```javascript
{
  email: {
    isEmail: true,
    normalizeEmail: true,
    trim: true,
    toLowerCase: true,
    notEmpty: true,
    errorMessage: 'Valid email is required'
  }
}
```

### Reset Password Validator
```javascript
{
  token: {
    notEmpty: true,
    trim: true,
    errorMessage: 'Reset token is required'
  },
  newPassword: {
    isLength: { min: 8, max: 128 },
    matches: {
      options: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ],
      errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    },
    notEmpty: true,
    errorMessage: 'New password is required'
  }
}
```

### Verify Email Validator
```javascript
{
  token: {
    notEmpty: true,
    trim: true,
    errorMessage: 'Verification token is required'
  }
}
```

---

## User Management Validation Rules

### Update Profile Validator
```javascript
{
  firstName: {
    optional: true,
    isLength: { min: 2, max: 50 },
    trim: true,
    escape: true,
    matches: {
      options: [/^[a-zA-Z\s]+$/],
      errorMessage: 'First name must contain only letters and spaces'
    },
    errorMessage: 'First name must be 2-50 characters'
  },
  lastName: {
    optional: true,
    isLength: { min: 2, max: 50 },
    trim: true,
    escape: true,
    matches: {
      options: [/^[a-zA-Z\s]+$/],
      errorMessage: 'Last name must contain only letters and spaces'
    },
    errorMessage: 'Last name must be 2-50 characters'
  },
  phoneNumber: {
    optional: true,
    isMobilePhone: { options: ['en-IN'] },
    trim: true,
    errorMessage: 'Valid phone number is required'
  },
  dateOfBirth: {
    optional: true,
    isISO8601: true,
    errorMessage: 'Valid date of birth is required (ISO 8601 format)'
  },
  gender: {
    optional: true,
    isIn: {
      options: [['male', 'female', 'other', 'prefer_not_to_say']],
      errorMessage: 'Gender must be male, female, other, or prefer_not_to_say'
    }
  }
}
```

### Add Address Validator
```javascript
{
  fullName: {
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'Full name is required (2-100 characters)'
  },
  phoneNumber: {
    isMobilePhone: { options: ['en-IN'] },
    trim: true,
    notEmpty: true,
    errorMessage: 'Valid phone number is required'
  },
  addressLine1: {
    isLength: { min: 5, max: 255 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'Address line 1 is required (5-255 characters)'
  },
  addressLine2: {
    optional: true,
    isLength: { max: 255 },
    trim: true,
    escape: true,
    errorMessage: 'Address line 2 must be less than 255 characters'
  },
  city: {
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'City is required (2-100 characters)'
  },
  state: {
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'State is required (2-100 characters)'
  },
  country: {
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'Country is required (2-100 characters)'
  },
  postalCode: {
    isLength: { min: 3, max: 20 },
    trim: true,
    escape: true,
    notEmpty: true,
    matches: {
      options: [/^[a-zA-Z0-9\s-]+$/],
      errorMessage: 'Postal code must contain only letters, numbers, spaces, and hyphens'
    },
    errorMessage: 'Postal code is required (3-20 characters)'
  },
  addressType: {
    optional: true,
    isIn: {
      options: [['home', 'office', 'other']],
      errorMessage: 'Address type must be home, office, or other'
    }
  },
  isDefault: {
    optional: true,
    isBoolean: true,
    errorMessage: 'isDefault must be a boolean'
  }
}
```

### Update Address Validator
```javascript
{
  fullName: {
    optional: true,
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    errorMessage: 'Full name must be 2-100 characters'
  },
  phoneNumber: {
    optional: true,
    isMobilePhone: { options: ['en-IN'] },
    trim: true,
    errorMessage: 'Valid phone number is required'
  },
  addressLine1: {
    optional: true,
    isLength: { min: 5, max: 255 },
    trim: true,
    escape: true,
    errorMessage: 'Address line 1 must be 5-255 characters'
  },
  addressLine2: {
    optional: true,
    isLength: { max: 255 },
    trim: true,
    escape: true,
    errorMessage: 'Address line 2 must be less than 255 characters'
  },
  city: {
    optional: true,
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    errorMessage: 'City must be 2-100 characters'
  },
  state: {
    optional: true,
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    errorMessage: 'State must be 2-100 characters'
  },
  postalCode: {
    optional: true,
    isLength: { min: 3, max: 20 },
    trim: true,
    escape: true,
    matches: {
      options: [/^[a-zA-Z0-9\s-]+$/],
      errorMessage: 'Postal code must contain only letters, numbers, spaces, and hyphens'
    },
    errorMessage: 'Postal code must be 3-20 characters'
  },
  addressType: {
    optional: true,
    isIn: {
      options: [['home', 'office', 'other']],
      errorMessage: 'Address type must be home, office, or other'
    }
  },
  isDefault: {
    optional: true,
    isBoolean: true,
    errorMessage: 'isDefault must be a boolean'
  }
}
```

---

## Product Management Validation Rules

### Create Product Validator
```javascript
{
  title: {
    isLength: { min: 5, max: 200 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'Product title is required (5-200 characters)'
  },
  description: {
    isLength: { min: 20, max: 5000 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'Product description is required (20-5000 characters)'
  },
  shortDescription: {
    optional: true,
    isLength: { max: 500 },
    trim: true,
    escape: true,
    errorMessage: 'Short description must be less than 500 characters'
  },
  brandId: {
    notEmpty: true,
    isMongoId: true,
    errorMessage: 'Valid brand ID is required'
  },
  categoryId: {
    notEmpty: true,
    isMongoId: true,
    errorMessage: 'Valid category ID is required'
  },
  images: {
    isArray: true,
    notEmpty: true,
    isArray: { min: 1, max: 10 },
    custom: {
      options: (value) => {
        return value.every(url => /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(url));
      },
      errorMessage: 'All images must be valid URLs (jpg, jpeg, png, webp)'
    },
    errorMessage: 'At least 1 image is required (max 10)'
  },
  price: {
    isFloat: { min: 0, max: 10000000 },
    notEmpty: true,
    toFloat: true,
    errorMessage: 'Valid price is required (0-10,000,000)'
  },
  discount: {
    optional: true,
    isFloat: { min: 0, max: 100 },
    toFloat: true,
    errorMessage: 'Discount must be between 0 and 100'
  },
  stock: {
    isInt: { min: 0, max: 100000 },
    toInt: true,
    errorMessage: 'Stock must be an integer (0-100,000)'
  },
  specifications: {
    optional: true,
    isObject: true,
    errorMessage: 'Specifications must be an object'
  },
  tags: {
    optional: true,
    isArray: true,
    custom: {
      options: (value) => {
        return value.every(tag => typeof tag === 'string' && tag.length >= 2 && tag.length <= 50);
      },
      errorMessage: 'All tags must be strings (2-50 characters)'
    },
    errorMessage: 'Tags must be an array of strings'
  },
  isFeatured: {
    optional: true,
    isBoolean: true,
    errorMessage: 'isFeatured must be a boolean'
  }
}
```

### Update Product Validator
```javascript
{
  title: {
    optional: true,
    isLength: { min: 5, max: 200 },
    trim: true,
    escape: true,
    errorMessage: 'Product title must be 5-200 characters'
  },
  description: {
    optional: true,
    isLength: { min: 20, max: 5000 },
    trim: true,
    escape: true,
    errorMessage: 'Product description must be 20-5000 characters'
  },
  shortDescription: {
    optional: true,
    isLength: { max: 500 },
    trim: true,
    escape: true,
    errorMessage: 'Short description must be less than 500 characters'
  },
  brandId: {
    optional: true,
    isMongoId: true,
    errorMessage: 'Valid brand ID is required'
  },
  categoryId: {
    optional: true,
    isMongoId: true,
    errorMessage: 'Valid category ID is required'
  },
  images: {
    optional: true,
    isArray: true,
    isArray: { min: 1, max: 10 },
    custom: {
      options: (value) => {
        return value.every(url => /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(url));
      },
      errorMessage: 'All images must be valid URLs (jpg, jpeg, png, webp)'
    },
    errorMessage: 'Images must be an array of valid URLs (1-10)'
  },
  price: {
    optional: true,
    isFloat: { min: 0, max: 10000000 },
    toFloat: true,
    errorMessage: 'Price must be between 0 and 10,000,000'
  },
  discount: {
    optional: true,
    isFloat: { min: 0, max: 100 },
    toFloat: true,
    errorMessage: 'Discount must be between 0 and 100'
  },
  stock: {
    optional: true,
    isInt: { min: 0, max: 100000 },
    toInt: true,
    errorMessage: 'Stock must be an integer (0-100,000)'
  },
  specifications: {
    optional: true,
    isObject: true,
    errorMessage: 'Specifications must be an object'
  },
  tags: {
    optional: true,
    isArray: true,
    custom: {
      options: (value) => {
        return value.every(tag => typeof tag === 'string' && tag.length >= 2 && tag.length <= 50);
      },
      errorMessage: 'All tags must be strings (2-50 characters)'
    },
    errorMessage: 'Tags must be an array of strings'
  },
  isFeatured: {
    optional: true,
    isBoolean: true,
    errorMessage: 'isFeatured must be a boolean'
  }
}
```

### Product Query Validator
```javascript
{
  page: {
    optional: true,
    isInt: { min: 1 },
    toInt: true,
    errorMessage: 'Page must be a positive integer'
  },
  limit: {
    optional: true,
    isInt: { min: 1, max: 50 },
    toInt: true,
    errorMessage: 'Limit must be an integer (1-50)'
  },
  category: {
    optional: true,
    isMongoId: true,
    errorMessage: 'Valid category ID is required'
  },
  brand: {
    optional: true,
    isMongoId: true,
    errorMessage: 'Valid brand ID is required'
  },
  search: {
    optional: true,
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    errorMessage: 'Search query must be 2-100 characters'
  },
  minPrice: {
    optional: true,
    isFloat: { min: 0 },
    toFloat: true,
    errorMessage: 'Min price must be a positive number'
  },
  maxPrice: {
    optional: true,
    isFloat: { min: 0 },
    toFloat: true,
    errorMessage: 'Max price must be a positive number'
  },
  sortBy: {
    optional: true,
    isIn: {
      options: [['price', 'rating', 'newest', 'popularity']],
      errorMessage: 'Sort by must be price, rating, newest, or popularity'
    }
  },
  sortOrder: {
    optional: true,
    isIn: {
      options: [['asc', 'desc']],
      errorMessage: 'Sort order must be asc or desc'
    }
  }
}
```

---

## Category Validation Rules

### Create Category Validator
```javascript
{
  name: {
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'Category name is required (2-100 characters)'
  },
  description: {
    optional: true,
    isLength: { max: 500 },
    trim: true,
    escape: true,
    errorMessage: 'Description must be less than 500 characters'
  },
  parentId: {
    optional: true,
    isMongoId: true,
    errorMessage: 'Valid parent category ID is required'
  },
  image: {
    optional: true,
    isURL: {
      protocols: ['http', 'https'],
      require_protocol: true
    },
    errorMessage: 'Valid image URL is required'
  },
  icon: {
    optional: true,
    isURL: {
      protocols: ['http', 'https'],
      require_protocol: true
    },
    errorMessage: 'Valid icon URL is required'
  }
}
```

### Update Category Validator
```javascript
{
  name: {
    optional: true,
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    errorMessage: 'Category name must be 2-100 characters'
  },
  description: {
    optional: true,
    isLength: { max: 500 },
    trim: true,
    escape: true,
    errorMessage: 'Description must be less than 500 characters'
  },
  parentId: {
    optional: true,
    isMongoId: true,
    errorMessage: 'Valid parent category ID is required'
  },
  image: {
    optional: true,
    isURL: {
      protocols: ['http', 'https'],
      require_protocol: true
    },
    errorMessage: 'Valid image URL is required'
  },
  icon: {
    optional: true,
    isURL: {
      protocols: ['http', 'https'],
      require_protocol: true
    },
    errorMessage: 'Valid icon URL is required'
  }
}
```

---

## Brand Validation Rules

### Create Brand Validator
```javascript
{
  name: {
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'Brand name is required (2-100 characters)'
  },
  description: {
    optional: true,
    isLength: { max: 500 },
    trim: true,
    escape: true,
    errorMessage: 'Description must be less than 500 characters'
  },
  logo: {
    optional: true,
    isURL: {
      protocols: ['http', 'https'],
      require_protocol: true
    },
    errorMessage: 'Valid logo URL is required'
  },
  website: {
    optional: true,
    isURL: {
      protocols: ['http', 'https'],
      require_protocol: true
    },
    errorMessage: 'Valid website URL is required'
  }
}
```

### Update Brand Validator
```javascript
{
  name: {
    optional: true,
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    errorMessage: 'Brand name must be 2-100 characters'
  },
  description: {
    optional: true,
    isLength: { max: 500 },
    trim: true,
    escape: true,
    errorMessage: 'Description must be less than 500 characters'
  },
  logo: {
    optional: true,
    isURL: {
      protocols: ['http', 'https'],
      require_protocol: true
    },
    errorMessage: 'Valid logo URL is required'
  },
  website: {
    optional: true,
    isURL: {
      protocols: ['http', 'https'],
      require_protocol: true
    },
    errorMessage: 'Valid website URL is required'
  }
}
```

---

## Cart Validation Rules

### Add to Cart Validator
```javascript
{
  productId: {
    notEmpty: true,
    isMongoId: true,
    errorMessage: 'Valid product ID is required'
  },
  quantity: {
    isInt: { min: 1, max: 100 },
    toInt: true,
    notEmpty: true,
    errorMessage: 'Quantity must be an integer (1-100)'
  }
}
```

### Update Cart Item Validator
```javascript
{
  quantity: {
    isInt: { min: 1, max: 100 },
    toInt: true,
    notEmpty: true,
    errorMessage: 'Quantity must be an integer (1-100)'
  }
}
```

### Apply Coupon Validator
```javascript
{
  code: {
    isLength: { min: 3, max: 50 },
    trim: true,
    toUpperCase: true,
    notEmpty: true,
    matches: {
      options: [/^[A-Z0-9]+$/],
      errorMessage: 'Coupon code must contain only uppercase letters and numbers'
    },
    errorMessage: 'Coupon code is required (3-50 characters)'
  }
}
```

---

## Wishlist Validation Rules

### Add to Wishlist Validator
```javascript
{
  productId: {
    notEmpty: true,
    isMongoId: true,
    errorMessage: 'Valid product ID is required'
  }
}
```

---

## Order Validation Rules

### Create Order Validator
```javascript
{
  shippingAddressId: {
    notEmpty: true,
    isMongoId: true,
    errorMessage: 'Valid shipping address ID is required'
  },
  billingAddressId: {
    optional: true,
    isMongoId: true,
    errorMessage: 'Valid billing address ID is required'
  },
  paymentMethod: {
    isIn: {
      options: [['razorpay', 'cod']],
      errorMessage: 'Payment method must be razorpay or cod'
    },
    notEmpty: true,
    errorMessage: 'Payment method is required'
  },
  couponCode: {
    optional: true,
    isLength: { min: 3, max: 50 },
    trim: true,
    toUpperCase: true,
    matches: {
      options: [/^[A-Z0-9]+$/],
      errorMessage: 'Coupon code must contain only uppercase letters and numbers'
    },
    errorMessage: 'Coupon code must be 3-50 characters'
  }
}
```

### Cancel Order Validator
```javascript
{
  reason: {
    isLength: { min: 5, max: 500 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'Cancellation reason is required (5-500 characters)'
  }
}
```

### Order Query Validator
```javascript
{
  page: {
    optional: true,
    isInt: { min: 1 },
    toInt: true,
    errorMessage: 'Page must be a positive integer'
  },
  limit: {
    optional: true,
    isInt: { min: 1, max: 50 },
    toInt: true,
    errorMessage: 'Limit must be an integer (1-50)'
  },
  status: {
    optional: true,
    isIn: {
      options: [['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded']],
      errorMessage: 'Invalid order status'
    }
  }
}
```

---

## Payment Validation Rules

### Create Payment Order Validator
```javascript
{
  amount: {
    isFloat: { min: 1, max: 10000000 },
    toFloat: true,
    notEmpty: true,
    errorMessage: 'Valid amount is required (1-10,000,000)'
  },
  currency: {
    optional: true,
    isLength: { min: 3, max: 3 },
    toUpperCase: true,
    errorMessage: 'Currency must be 3 characters (e.g., INR)'
  },
  orderId: {
    notEmpty: true,
    isMongoId: true,
    errorMessage: 'Valid order ID is required'
  }
}
```

### Verify Payment Validator
```javascript
{
  razorpayOrderId: {
    notEmpty: true,
    trim: true,
    errorMessage: 'Razorpay order ID is required'
  },
  razorpayPaymentId: {
    notEmpty: true,
    trim: true,
    errorMessage: 'Razorpay payment ID is required'
  },
  razorpaySignature: {
    notEmpty: true,
    trim: true,
    errorMessage: 'Razorpay signature is required'
  },
  orderId: {
    notEmpty: true,
    isMongoId: true,
    errorMessage: 'Valid order ID is required'
  }
}
```

---

## Review Validation Rules

### Add Review Validator
```javascript
{
  rating: {
    isInt: { min: 1, max: 5 },
    toInt: true,
    notEmpty: true,
    errorMessage: 'Rating must be an integer (1-5)'
  },
  title: {
    optional: true,
    isLength: { min: 5, max: 100 },
    trim: true,
    escape: true,
    errorMessage: 'Review title must be 5-100 characters'
  },
  comment: {
    isLength: { min: 10, max: 1000 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'Review comment is required (10-1000 characters)'
  },
  orderId: {
    optional: true,
    isMongoId: true,
    errorMessage: 'Valid order ID is required'
  },
  images: {
    optional: true,
    isArray: true,
    isArray: { min: 0, max: 5 },
    custom: {
      options: (value) => {
        return value.every(url => /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(url));
      },
      errorMessage: 'All images must be valid URLs (jpg, jpeg, png, webp)'
    },
    errorMessage: 'Images must be an array of valid URLs (max 5)'
  }
}
```

### Update Review Validator
```javascript
{
  rating: {
    optional: true,
    isInt: { min: 1, max: 5 },
    toInt: true,
    errorMessage: 'Rating must be an integer (1-5)'
  },
  title: {
    optional: true,
    isLength: { min: 5, max: 100 },
    trim: true,
    escape: true,
    errorMessage: 'Review title must be 5-100 characters'
  },
  comment: {
    optional: true,
    isLength: { min: 10, max: 1000 },
    trim: true,
    escape: true,
    errorMessage: 'Review comment must be 10-1000 characters'
  }
}
```

### Review Query Validator
```javascript
{
  page: {
    optional: true,
    isInt: { min: 1 },
    toInt: true,
    errorMessage: 'Page must be a positive integer'
  },
  limit: {
    optional: true,
    isInt: { min: 1, max: 50 },
    toInt: true,
    errorMessage: 'Limit must be an integer (1-50)'
  },
  rating: {
    optional: true,
    isInt: { min: 1, max: 5 },
    toInt: true,
    errorMessage: 'Rating must be an integer (1-5)'
  }
}
```

---

## Coupon Validation Rules

### Create Coupon Validator
```javascript
{
  code: {
    isLength: { min: 3, max: 50 },
    trim: true,
    toUpperCase: true,
    notEmpty: true,
    matches: {
      options: [/^[A-Z0-9]+$/],
      errorMessage: 'Coupon code must contain only uppercase letters and numbers'
    },
    errorMessage: 'Coupon code is required (3-50 characters)'
  },
  description: {
    optional: true,
    isLength: { max: 500 },
    trim: true,
    escape: true,
    errorMessage: 'Description must be less than 500 characters'
  },
  discountType: {
    isIn: {
      options: [['percentage', 'fixed']],
      errorMessage: 'Discount type must be percentage or fixed'
    },
    notEmpty: true,
    errorMessage: 'Discount type is required'
  },
  discountValue: {
    isFloat: { min: 0 },
    toFloat: true,
    notEmpty: true,
    errorMessage: 'Discount value must be a positive number'
  },
  maxDiscountAmount: {
    optional: true,
    isFloat: { min: 0 },
    toFloat: true,
    errorMessage: 'Max discount amount must be a positive number'
  },
  minOrderAmount: {
    optional: true,
    isFloat: { min: 0 },
    toFloat: true,
    errorMessage: 'Min order amount must be a positive number'
  },
  usageLimit: {
    optional: true,
    isInt: { min: 1 },
    toInt: true,
    errorMessage: 'Usage limit must be a positive integer'
  },
  usageLimitPerUser: {
    optional: true,
    isInt: { min: 1 },
    toInt: true,
    errorMessage: 'Usage limit per user must be a positive integer'
  },
  validFrom: {
    isISO8601: true,
    notEmpty: true,
    errorMessage: 'Valid from date is required (ISO 8601 format)'
  },
  validUntil: {
    isISO8601: true,
    notEmpty: true,
    errorMessage: 'Valid until date is required (ISO 8601 format)'
  },
  applicableCategories: {
    optional: true,
    isArray: true,
    custom: {
      options: (value) => {
        return value.every(id => /^[0-9a-fA-F]{24}$/.test(id));
      },
      errorMessage: 'All category IDs must be valid MongoDB IDs'
    },
    errorMessage: 'Applicable categories must be an array of MongoDB IDs'
  },
  applicableBrands: {
    optional: true,
    isArray: true,
    custom: {
      options: (value) => {
        return value.every(id => /^[0-9a-fA-F]{24}$/.test(id));
      },
      errorMessage: 'All brand IDs must be valid MongoDB IDs'
    },
    errorMessage: 'Applicable brands must be an array of MongoDB IDs'
  },
  applicableProducts: {
    optional: true,
    isArray: true,
    custom: {
      options: (value) => {
        return value.every(id => /^[0-9a-fA-F]{24}$/.test(id));
      },
      errorMessage: 'All product IDs must be valid MongoDB IDs'
    },
    errorMessage: 'Applicable products must be an array of MongoDB IDs'
  }
}
```

### Update Coupon Validator
```javascript
{
  code: {
    optional: true,
    isLength: { min: 3, max: 50 },
    trim: true,
    toUpperCase: true,
    matches: {
      options: [/^[A-Z0-9]+$/],
      errorMessage: 'Coupon code must contain only uppercase letters and numbers'
    },
    errorMessage: 'Coupon code must be 3-50 characters'
  },
  description: {
    optional: true,
    isLength: { max: 500 },
    trim: true,
    escape: true,
    errorMessage: 'Description must be less than 500 characters'
  },
  discountType: {
    optional: true,
    isIn: {
      options: [['percentage', 'fixed']],
      errorMessage: 'Discount type must be percentage or fixed'
    }
  },
  discountValue: {
    optional: true,
    isFloat: { min: 0 },
    toFloat: true,
    errorMessage: 'Discount value must be a positive number'
  },
  maxDiscountAmount: {
    optional: true,
    isFloat: { min: 0 },
    toFloat: true,
    errorMessage: 'Max discount amount must be a positive number'
  },
  minOrderAmount: {
    optional: true,
    isFloat: { min: 0 },
    toFloat: true,
    errorMessage: 'Min order amount must be a positive number'
  },
  usageLimit: {
    optional: true,
    isInt: { min: 1 },
    toInt: true,
    errorMessage: 'Usage limit must be a positive integer'
  },
  usageLimitPerUser: {
    optional: true,
    isInt: { min: 1 },
    toInt: true,
    errorMessage: 'Usage limit per user must be a positive integer'
  },
  validFrom: {
    optional: true,
    isISO8601: true,
    errorMessage: 'Valid from date is required (ISO 8601 format)'
  },
  validUntil: {
    optional: true,
    isISO8601: true,
    errorMessage: 'Valid until date is required (ISO 8601 format)'
  }
}
```

### Validate Coupon Validator
```javascript
{
  code: {
    isLength: { min: 3, max: 50 },
    trim: true,
    toUpperCase: true,
    notEmpty: true,
    matches: {
      options: [/^[A-Z0-9]+$/],
      errorMessage: 'Coupon code must contain only uppercase letters and numbers'
    },
    errorMessage: 'Coupon code is required (3-50 characters)'
  },
  cartTotal: {
    isFloat: { min: 0 },
    toFloat: true,
    notEmpty: true,
    errorMessage: 'Cart total must be a positive number'
  }
}
```

---

## Notification Validation Rules

### Notification Query Validator
```javascript
{
  page: {
    optional: true,
    isInt: { min: 1 },
    toInt: true,
    errorMessage: 'Page must be a positive integer'
  },
  limit: {
    optional: true,
    isInt: { min: 1, max: 50 },
    toInt: true,
    errorMessage: 'Limit must be an integer (1-50)'
  },
  unread: {
    optional: true,
    isBoolean: true,
    toBoolean: true,
    errorMessage: 'Unread must be a boolean'
  }
}
```

---

## Admin Validation Rules

### Update User Role Validator
```javascript
{
  role: {
    isIn: {
      options: [['customer', 'admin', 'super_admin']],
      errorMessage: 'Role must be customer, admin, or super_admin'
    },
    notEmpty: true,
    errorMessage: 'Role is required'
  }
}
```

### Update Order Status Validator
```javascript
{
  status: {
    isIn: {
      options: [['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded']],
      errorMessage: 'Invalid order status'
    },
    notEmpty: true,
    errorMessage: 'Status is required'
  },
  note: {
    optional: true,
    isLength: { max: 500 },
    trim: true,
    escape: true,
    errorMessage: 'Note must be less than 500 characters'
  }
}
```

### Update Inventory Validator
```javascript
{
  currentStock: {
    isInt: { min: 0, max: 100000 },
    toInt: true,
    notEmpty: true,
    errorMessage: 'Current stock must be an integer (0-100,000)'
  },
  changeType: {
    isIn: {
      options: [['restock', 'sale', 'return', 'adjustment', 'damage']],
      errorMessage: 'Change type must be restock, sale, return, adjustment, or damage'
    },
    notEmpty: true,
    errorMessage: 'Change type is required'
  },
  reason: {
    isLength: { min: 5, max: 500 },
    trim: true,
    escape: true,
    notEmpty: true,
    errorMessage: 'Reason is required (5-500 characters)'
  },
  quantityChanged: {
    isInt: { min: -100000, max: 100000 },
    toInt: true,
    notEmpty: true,
    errorMessage: 'Quantity changed must be an integer'
  }
}
```

### Process Refund Validator
```javascript
{
  action: {
    isIn: {
      options: [['approve', 'reject']],
      errorMessage: 'Action must be approve or reject'
    },
    notEmpty: true,
    errorMessage: 'Action is required'
  },
  reason: {
    optional: true,
    isLength: { max: 500 },
    trim: true,
    escape: true,
    errorMessage: 'Reason must be less than 500 characters'
  }
}
```

### Admin Query Validator
```javascript
{
  page: {
    optional: true,
    isInt: { min: 1 },
    toInt: true,
    errorMessage: 'Page must be a positive integer'
  },
  limit: {
    optional: true,
    isInt: { min: 1, max: 50 },
    toInt: true,
    errorMessage: 'Limit must be an integer (1-50)'
  },
  search: {
    optional: true,
    isLength: { min: 2, max: 100 },
    trim: true,
    escape: true,
    errorMessage: 'Search query must be 2-100 characters'
  },
  role: {
    optional: true,
    isIn: {
      options: [['customer', 'admin', 'super_admin']],
      errorMessage: 'Role must be customer, admin, or super_admin'
    }
  },
  status: {
    optional: true,
    isIn: {
      options: [['active', 'inactive']],
      errorMessage: 'Status must be active or inactive'
    }
  },
  dateFrom: {
    optional: true,
    isISO8601: true,
    errorMessage: 'Date from must be in ISO 8601 format'
  },
  dateTo: {
    optional: true,
    isISO8601: true,
    errorMessage: 'Date to must be in ISO 8601 format'
  }
}
```

---

## File Upload Validation

### Image Upload Validator
```javascript
{
  fieldname: 'profilePicture' | 'images',
  maxCount: 1 (for profile picture) | 10 (for product images),
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxSize: 5MB (5242880 bytes),
  minWidth: 100px,
  minHeight: 100px,
  maxWidth: 4000px,
  maxHeight: 4000px
}
```

---

## Common Validation Rules

### MongoDB ID Validation
```javascript
{
  isMongoId: true,
  errorMessage: 'Valid MongoDB ID is required'
}
```

### Pagination Validation
```javascript
{
  page: {
    optional: true,
    isInt: { min: 1 },
    toInt: true,
    errorMessage: 'Page must be a positive integer'
  },
  limit: {
    optional: true,
    isInt: { min: 1, max: 50 },
    toInt: true,
    errorMessage: 'Limit must be an integer (1-50)'
  }
}
```

### Boolean Validation
```javascript
{
  isBoolean: true,
  toBoolean: true,
  errorMessage: 'Must be a boolean value'
}
```

### URL Validation
```javascript
{
  isURL: {
    protocols: ['http', 'https'],
    require_protocol: true
  },
  errorMessage: 'Valid URL is required'
}
```

### Date Validation
```javascript
{
  isISO8601: true,
  errorMessage: 'Valid date is required (ISO 8601 format)'
}
```

### Email Validation
```javascript
{
  isEmail: true,
  normalizeEmail: true,
  trim: true,
  toLowerCase: true,
  errorMessage: 'Valid email is required'
}
```

---

## Business Rule Validation (Service Layer)

### Business Rules to Validate in Services

1. **Stock Availability**: Check if product has sufficient stock before adding to cart
2. **Coupon Validity**: Check coupon expiry date, usage limits, and applicability
3. **Order Cancellation**: Check if order can be cancelled based on status
4. **Review Eligibility**: Check if user is a verified purchaser
5. **Address Limits**: Check if user has exceeded maximum address limit
6. **Payment Amount**: Check if payment amount matches order total
7. **Refund Eligibility**: Check if order is eligible for refund
8. **Category Hierarchy**: Check if category hierarchy is valid
9. **Product Uniqueness**: Check if product slug is unique
10. **User Permissions**: Check if user has required permissions

---

## Validation Error Response Format

```javascript
{
  success: false,
  message: 'Validation failed',
  error: {
    code: 'VALIDATION_ERROR',
    details: [
      {
        field: 'email',
        message: 'Valid email is required',
        value: 'invalid-email'
      },
      {
        field: 'password',
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        value: 'weak'
      }
    ]
  },
  meta: {
    timestamp: '2026-06-14T18:30:00.000Z',
    requestId: 'req_123456789'
  }
}
```

---

## Sanitization Rules

### Common Sanitization
- `trim`: Remove whitespace from both ends
- `escape`: Replace <, >, &, ', " with HTML entities
- `toLowerCase`: Convert to lowercase
- `toUpperCase`: Convert to uppercase
- `normalizeEmail`: Normalize email address
- `toFloat`: Convert to float
- `toInt`: Convert to integer
- `toBoolean`: Convert to boolean

### Custom Sanitization
- Remove HTML tags from user input
- Remove SQL injection patterns
- Remove XSS attack vectors
- Remove malicious characters

---

## Validation Middleware Implementation

### Middleware Structure
```javascript
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      error: {
        code: 'VALIDATION_ERROR',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      }
    });
  }
  next();
};

module.exports = validate;
```

---

## Conclusion

This validation design provides:
- **Comprehensive Coverage**: All API endpoints validated
- **Security**: Input sanitization and validation
- **User Experience**: Clear error messages
- **Consistency**: Standardized validation rules
- **Maintainability**: Centralized validation schemas
- **Performance**: Efficient validation at middleware layer
- **Business Logic**: Service layer validation for business rules
