const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Order ID is required'],
    ref: 'Order',
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Product ID is required'],
    ref: 'Product',
    index: true
  },
  productTitle: {
    type: String,
    required: [true, 'Product title is required']
  },
  productImage: String,
  brand: String,
  category: String,
  selectedSize: String,
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  discountedPrice: Number,
  discount: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required']
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isReturned: {
    type: Boolean,
    default: false
  },
  returnReason: String,
  returnedAt: Date
}, {
  timestamps: true
});

// IndexesorderItemSchema.index({ orderId: 1, productId: 1 });

// Calculate subtotal before saving
orderItemSchema.pre('validate', function(next) {
  const price = this.discountedPrice || this.price;
  this.subtotal = price * this.quantity;
  next();
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
