# ShopPilot AI - Database Schema Design

## Database Overview

**Database**: MongoDB Atlas  
**ODM**: Mongoose  
**Collections**: 18 collections designed for e-commerce operations

---

## Collection: users

### Purpose
Store user accounts, authentication credentials, and profile information.

### Schema
```javascript
{
  _id: ObjectId,
  email: String (unique, required, indexed),
  password: String (required, bcrypt hashed),
  firstName: String (required),
  lastName: String (required),
  phoneNumber: String,
  role: String (enum: ['customer', 'admin', 'super_admin'], default: 'customer'),
  isEmailVerified: Boolean (default: false),
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  profilePicture: String (Cloudinary URL),
  dateOfBirth: Date,
  gender: String (enum: ['male', 'female', 'other', 'prefer_not_to_say']),
  isActive: Boolean (default: true),
  isDeleted: Boolean (default: false),
  lastLogin: Date,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `email`: unique index
- `phoneNumber`: index
- `role`: index
- `isActive`: index
- `createdAt`: index (for sorting)

### Relationships
- One-to-many with addresses
- One-to-many with orders
- One-to-many with reviews
- One-to-many with cart
- One-to-many with wishlist

---

## Collection: addresses

### Purpose
Store user shipping and billing addresses.

### Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, indexed, ref: 'users'),
  fullName: String (required),
  phoneNumber: String (required),
  addressLine1: String (required),
  addressLine2: String,
  city: String (required),
  state: String (required),
  country: String (required, default: 'India'),
  postalCode: String (required),
  addressType: String (enum: ['home', 'office', 'other'], default: 'home'),
  isDefault: Boolean (default: false),
  isDeleted: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `userId`: index
- `userId + isDefault`: compound index
- `isDeleted`: index

### Relationships
- Many-to-one with users

---

## Collection: categories

### Purpose
Store product categories with hierarchical structure.

### Schema
```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  slug: String (required, unique, indexed),
  description: String,
  parentId: ObjectId (ref: 'categories', nullable),
  level: Number (default: 0),
  image: String (Cloudinary URL),
  icon: String (Cloudinary URL),
  isActive: Boolean (default: true),
  isDeleted: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `slug`: unique index
- `parentId`: index
- `isActive`: index
- `level`: index

### Relationships
- Self-referential (parent-child hierarchy)
- One-to-many with products

---

## Collection: brands

### Purpose
Store product brand information.

### Schema
```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  slug: String (required, unique, indexed),
  description: String,
  logo: String (Cloudinary URL),
  website: String,
  isActive: Boolean (default: true),
  isDeleted: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `slug`: unique index
- `name`: unique index
- `isActive`: index

### Relationships
- One-to-many with products

---

## Collection: products

### Purpose
Store product information with specifications and pricing.

### Schema
```javascript
{
  _id: ObjectId,
  title: String (required, indexed),
  slug: String (required, unique, indexed),
  description: String (required),
  shortDescription: String,
  brandId: ObjectId (required, indexed, ref: 'brands'),
  categoryId: ObjectId (required, indexed, ref: 'categories'),
  images: [String] (Cloudinary URLs, required),
  price: Number (required, min: 0),
  discount: Number (default: 0, min: 0, max: 100),
  discountedPrice: Number (calculated),
  currency: String (default: 'INR'),
  stock: Number (default: 0, min: 0),
  rating: Number (default: 0, min: 0, max: 5),
  reviewCount: Number (default: 0),
  soldCount: Number (default: 0),
  viewCount: Number (default: 0),
  specifications: {
    // Dynamic key-value pairs for product specs
    color: String,
    size: String,
    material: String,
    weight: Number,
    dimensions: String,
    warranty: String,
    // ... any other specifications
  },
  tags: [String],
  isActive: Boolean (default: true),
  isFeatured: Boolean (default: false),
  isDeleted: Boolean (default: false),
  createdBy: ObjectId (ref: 'users'),
  updatedBy: ObjectId (ref: 'users'),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `slug`: unique index
- `title`: text index (for search)
- `brandId`: index
- `categoryId`: index
- `price`: index
- `discountedPrice`: index
- `rating`: index
- `isActive`: index
- `isFeatured`: index
- `createdAt`: index
- Compound: `categoryId + isActive`
- Compound: `brandId + isActive`

### Relationships
- Many-to-one with brands
- Many-to-one with categories
- One-to-one with inventory
- One-to-many with reviews
- One-to-many with orderItems
- One-to-many with cartItems

---

## Collection: inventory

### Purpose
Track product inventory with stock levels and alerts.

### Schema
```javascript
{
  _id: ObjectId,
  productId: ObjectId (required, unique, indexed, ref: 'products'),
  currentStock: Number (required, default: 0),
  reservedStock: Number (default: 0),
  availableStock: Number (calculated: currentStock - reservedStock),
  lowStockThreshold: Number (default: 10),
  outOfStockThreshold: Number (default: 0),
  lastRestockDate: Date,
  lastStockUpdate: Date,
  warehouseLocation: String,
  isActive: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `productId`: unique index
- `availableStock`: index
- `isActive`: index

### Relationships
- One-to-one with products
- One-to-many with inventoryLogs

---

## Collection: inventoryLogs

### Purpose
Track all inventory changes for audit and analytics.

### Schema
```javascript
{
  _id: ObjectId,
  productId: ObjectId (required, indexed, ref: 'products'),
  inventoryId: ObjectId (required, ref: 'inventory'),
  previousStock: Number,
  newStock: Number,
  changeType: String (enum: ['restock', 'sale', 'return', 'adjustment', 'damage']),
  quantityChanged: Number (required),
  reason: String,
  referenceId: ObjectId (orderId, refundId, etc.),
  referenceType: String,
  performedBy: ObjectId (ref: 'users'),
  notes: String,
  createdAt: Date (default: Date.now)
}
```

### Indexes
- `productId`: index
- `inventoryId`: index
- `changeType`: index
- `createdAt`: index
- Compound: `productId + changeType`

### Relationships
- Many-to-one with products
- Many-to-one with inventory

---

## Collection: carts

### Purpose
Store user shopping cart data.

### Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, unique, indexed, ref: 'users'),
  items: [{
    productId: ObjectId (required, ref: 'products'),
    quantity: Number (required, min: 1, default: 1),
    price: Number (required),
    discountedPrice: Number,
    addedAt: Date (default: Date.now)
  }],
  appliedCoupon: {
    couponId: ObjectId (ref: 'coupons'),
    code: String,
    discountAmount: Number
  },
  subtotal: Number (calculated),
  totalDiscount: Number (calculated),
  totalAmount: Number (calculated),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `userId`: unique index

### Relationships
- One-to-one with users
- Many-to-one with products (via items)
- Many-to-one with coupons (via appliedCoupon)

---

## Collection: wishlists

### Purpose
Store user wishlist items.

### Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, unique, indexed, ref: 'users'),
  items: [{
    productId: ObjectId (required, ref: 'products'),
    addedAt: Date (default: Date.now)
  }],
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `userId`: unique index

### Relationships
- One-to-one with users
- Many-to-one with products (via items)

---

## Collection: orders

### Purpose
Store order information and status.

### Schema
```javascript
{
  _id: ObjectId,
  orderNumber: String (required, unique, indexed),
  userId: ObjectId (required, indexed, ref: 'users'),
  items: [ObjectId] (ref: 'orderItems'),
  shippingAddress: {
    fullName: String,
    phoneNumber: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  billingAddress: {
    fullName: String,
    phoneNumber: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  subtotal: Number (required),
  discount: Number (default: 0),
  shippingCharge: Number (default: 0),
  tax: Number (default: 0),
  totalAmount: Number (required),
  paymentMethod: String (enum: ['razorpay', 'cod'], default: 'razorpay'),
  paymentStatus: String (enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending'),
  paymentId: ObjectId (ref: 'payments'),
  orderStatus: String (enum: ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'], default: 'pending'),
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String,
    updatedBy: ObjectId (ref: 'users')
  }],
  coupon: {
    couponId: ObjectId (ref: 'coupons'),
    code: String,
    discountAmount: Number
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  cancellationReason: String,
  returnReason: String,
  notes: String,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `orderNumber`: unique index
- `userId`: index
- `orderStatus`: index
- `paymentStatus`: index
- `createdAt`: index
- Compound: `userId + orderStatus`
- Compound: `orderStatus + createdAt`

### Relationships
- Many-to-one with users
- One-to-many with orderItems
- One-to-one with payments
- Many-to-one with coupons

---

## Collection: orderItems

### Purpose
Store individual items within an order.

### Schema
```javascript
{
  _id: ObjectId,
  orderId: ObjectId (required, indexed, ref: 'orders'),
  productId: ObjectId (required, indexed, ref: 'products'),
  productTitle: String (required),
  productImage: String,
  brand: String,
  category: String,
  quantity: Number (required, min: 1),
  price: Number (required),
  discountedPrice: Number,
  discount: Number (default: 0),
  subtotal: Number (calculated),
  specifications: Object,
  isReturned: Boolean (default: false),
  returnReason: String,
  returnedAt: Date,
  createdAt: Date (default: Date.now)
}
```

### Indexes
- `orderId`: index
- `productId`: index
- Compound: `orderId + productId`

### Relationships
- Many-to-one with orders
- Many-to-one with products

---

## Collection: payments

### Purpose
Store payment transaction details.

### Schema
```javascript
{
  _id: ObjectId,
  orderId: ObjectId (required, indexed, ref: 'orders'),
  userId: ObjectId (required, indexed, ref: 'users'),
  razorpayOrderId: String (unique, indexed),
  razorpayPaymentId: String (unique, indexed),
  razorpaySignature: String,
  amount: Number (required),
  currency: String (default: 'INR'),
  status: String (enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending'),
  paymentMethod: String,
  paymentDate: Date,
  failureReason: String,
  refundId: String,
  refundAmount: Number,
  refundStatus: String (enum: ['none', 'pending', 'success', 'failed'], default: 'none'),
  refundDate: Date,
  metadata: Object,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `razorpayOrderId`: unique index
- `razorpayPaymentId`: unique index
- `orderId`: index
- `userId`: index
- `status`: index
- `createdAt`: index

### Relationships
- One-to-one with orders
- Many-to-one with users

---

## Collection: refunds

### Purpose
Store refund requests and processing details.

### Schema
```javascript
{
  _id: ObjectId,
  orderId: ObjectId (required, indexed, ref: 'orders'),
  paymentId: ObjectId (required, ref: 'payments'),
  userId: ObjectId (required, indexed, ref: 'users'),
  refundAmount: Number (required),
  refundReason: String (required),
  refundType: String (enum: ['full', 'partial']),
  status: String (enum: ['pending', 'approved', 'rejected', 'processing', 'completed', 'failed'], default: 'pending'),
  razorpayRefundId: String,
  approvedBy: ObjectId (ref: 'users'),
  approvedAt: Date,
  rejectedBy: ObjectId (ref: 'users'),
  rejectedAt: Date,
  rejectionReason: String,
  completedAt: Date,
  notes: String,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `orderId`: index
- `paymentId`: index
- `userId`: index
- `status`: index
- `createdAt`: index

### Relationships
- Many-to-one with orders
- Many-to-one with payments
- Many-to-one with users

---

## Collection: reviews

### Purpose
Store product reviews and ratings.

### Schema
```javascript
{
  _id: ObjectId,
  productId: ObjectId (required, indexed, ref: 'products'),
  userId: ObjectId (required, indexed, ref: 'users'),
  orderId: ObjectId (ref: 'orders'),
  rating: Number (required, min: 1, max: 5),
  title: String,
  comment: String (required),
  images: [String] (Cloudinary URLs),
  isVerifiedPurchase: Boolean (default: false),
  isApproved: Boolean (default: true),
  helpfulCount: Number (default: 0),
  notHelpfulCount: Number (default: 0),
  isAdminResponse: Boolean (default: false),
  adminResponse: String,
  adminResponseAt: Date,
  isDeleted: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `productId`: index
- `userId`: index
- `orderId`: index
- `rating`: index
- `isVerifiedPurchase`: index
- `isApproved`: index
- `createdAt`: index
- Compound: `productId + rating`
- Compound: `productId + isVerifiedPurchase`

### Relationships
- Many-to-one with products
- Many-to-one with users
- Many-to-one with orders

---

## Collection: coupons

### Purpose
Store discount coupon information.

### Schema
```javascript
{
  _id: ObjectId,
  code: String (required, unique, indexed),
  description: String,
  discountType: String (enum: ['percentage', 'fixed'], required),
  discountValue: Number (required, min: 0),
  maxDiscountAmount: Number,
  minOrderAmount: Number (default: 0),
  usageLimit: Number (total usage limit),
  usageLimitPerUser: Number (default: 1),
  usedCount: Number (default: 0),
  validFrom: Date (required),
  validUntil: Date (required),
  applicableCategories: [ObjectId] (ref: 'categories'),
  applicableBrands: [ObjectId] (ref: 'brands'),
  applicableProducts: [ObjectId] (ref: 'products'),
  isActive: Boolean (default: true),
  isDeleted: Boolean (default: false),
  createdBy: ObjectId (ref: 'users'),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `code`: unique index
- `isActive`: index
- `validFrom`: index
- `validUntil`: index

### Relationships
- Many-to-many with categories
- Many-to-many with brands
- Many-to-many with products

---

## Collection: notifications

### Purpose
Store user notifications for orders, payments, and promotions.

### Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, indexed, ref: 'users'),
  type: String (enum: ['order', 'payment', 'refund', 'promotion', 'system'], required),
  title: String (required),
  message: String (required),
  data: Object (additional data),
  isRead: Boolean (default: false),
  readAt: Date,
  actionUrl: String,
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  relatedId: ObjectId (orderId, paymentId, etc.),
  relatedType: String,
  expiresAt: Date,
  createdAt: Date (default: Date.now)
}
```

### Indexes
- `userId`: index
- `type`: index
- `isRead`: index
- `createdAt`: index
- Compound: `userId + isRead`
- Compound: `userId + createdAt`

### Relationships
- Many-to-one with users

---

## Collection: auditLogs

### Purpose
Track all sensitive operations for security and compliance.

### Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed, ref: 'users'),
  action: String (required),
  entityType: String (required),
  entityId: ObjectId,
  changes: Object (before/after values),
  ipAddress: String,
  userAgent: String,
  timestamp: Date (default: Date.now),
  metadata: Object
}
```

### Indexes
- `userId`: index
- `action`: index
- `entityType`: index
- `timestamp`: index
- Compound: `userId + action`

### Relationships
- Many-to-one with users

---

## Database Relationships Summary

### User Relationships
- User → Addresses (1:N)
- User → Orders (1:N)
- User → Reviews (1:N)
- User → Cart (1:1)
- User → Wishlist (1:1)
- User → Payments (1:N)
- User → Refunds (1:N)
- User → Notifications (1:N)
- User → AuditLogs (1:N)

### Product Relationships
- Product → Category (N:1)
- Product → Brand (N:1)
- Product → Inventory (1:1)
- Product → Reviews (1:N)
- Product → OrderItems (1:N)
- Product → CartItems (1:N)
- Product → WishlistItems (1:N)
- Product → InventoryLogs (1:N)

### Order Relationships
- Order → User (N:1)
- Order → OrderItems (1:N)
- Order → Payment (1:1)
- Order → Coupon (N:1)
- Order → Refunds (1:N)

### Category Relationships
- Category → Products (1:N)
- Category → ParentCategory (N:1, self-referential)
- Category → ChildCategories (1:N, self-referential)

### Brand Relationships
- Brand → Products (1:N)

---

## Indexing Strategy

### Primary Indexes
All `_id` fields (default MongoDB indexes)

### Unique Indexes
- `users.email`
- `users.phoneNumber`
- `categories.slug`
- `brands.slug`
- `brands.name`
- `products.slug`
- `inventory.productId`
- `carts.userId`
- `wishlists.userId`
- `orders.orderNumber`
- `payments.razorpayOrderId`
- `payments.razorpayPaymentId`
- `coupons.code`

### Compound Indexes
- `categories.parentId + level`
- `products.categoryId + isActive`
- `products.brandId + isActive`
- `addresses.userId + isDefault`
- `orders.userId + orderStatus`
- `orders.orderStatus + createdAt`
- `orderItems.orderId + productId`
- `inventoryLogs.productId + changeType`
- `reviews.productId + rating`
- `reviews.productId + isVerifiedPurchase`
- `notifications.userId + isRead`
- `notifications.userId + createdAt`
- `auditLogs.userId + action`

### Text Indexes
- `products.title` (for full-text search)

### Single Field Indexes
All foreign key fields and frequently queried fields

---

## Data Validation Rules

### Common Rules
- All required fields must be present
- Email format validation
- Phone number format validation
- Positive numbers for prices, quantities
- Enum validation for status fields
- Date range validation for validity periods

### Business Rules
- Stock cannot be negative
- Discount cannot exceed 100%
- Rating must be between 1-5
- Order total must match items total
- Payment amount must match order total
- Coupon usage limits enforced
- Verified purchaser check for reviews

---

## Scaling Considerations

### Sharding Strategy (Future)
- Shard by `userId` for user-related collections
- Shard by `productId` for product-related collections
- Shard by `orderId` for order-related collections

### Read Optimization
- Use covered indexes where possible
- Implement read replicas for analytics queries
- Cache frequently accessed data in Redis

### Write Optimization
- Use bulk operations for batch inserts
- Implement write concern for critical operations
- Use transactions for multi-document operations

---

## Backup & Recovery Strategy

### Backup Strategy
- Daily automated backups
- Point-in-time recovery enabled
- Cross-region backup replication

### Recovery Strategy
- RPO (Recovery Point Objective): 15 minutes
- RTO (Recovery Time Objective): 1 hour
- Regular restore testing

---

## Security Considerations

### Data Encryption
- Field-level encryption for sensitive data
- TLS for data in transit
- Encryption at rest (MongoDB Atlas feature)

### Access Control
- Role-based access control at application level
- MongoDB Atlas IP whitelisting
- Principle of least privilege

### Data Privacy
- PII data identification and protection
- GDPR compliance considerations
- Data retention policies

---

## Future AI Integration Considerations

### AI-Ready Schema Design
- Rich product specifications for AI analysis
- User behavior tracking in audit logs
- Review sentiment analysis ready
- Purchase history for recommendation engines
- Search query logging for AI optimization

### Additional Collections (Future)
- `userBehavior`: Track user interactions
- `searchQueries`: Log search terms
- `recommendations`: Store AI-generated recommendations
- `aiInsights`: AI-generated business insights

---

## Conclusion

This database schema provides:
- **Comprehensive Coverage**: All e-commerce entities
- **Strong Relationships**: Proper foreign key relationships
- **Optimized Indexing**: Fast query performance
- **Data Integrity**: Validation rules and constraints
- **Scalability**: Ready for horizontal scaling
- **Security**: Access control and encryption
- **AI-Ready**: Designed for future AI integration
