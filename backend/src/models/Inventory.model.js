const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Product ID is required'],
    unique: true,
    ref: 'Product',
    index: true
  },
  currentStock: {
    type: Number,
    required: [true, 'Current stock is required'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  reservedStock: {
    type: Number,
    default: 0,
    min: [0, 'Reserved stock cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  outOfStockThreshold: {
    type: Number,
    default: 0
  },
  lastRestockDate: Date,
  lastStockUpdate: Date,
  warehouseLocation: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// IndexesinventorySchema.index({ isActive: 1 });

// Virtual for available stock
inventorySchema.virtual('availableStock').get(function() {
  return this.currentStock - this.reservedStock;
});

// Virtual for low stock
inventorySchema.virtual('isLowStock').get(function() {
  return this.availableStock <= this.lowStockThreshold;
});

// Virtual for out of stock
inventorySchema.virtual('isOutOfStock').get(function() {
  return this.availableStock <= this.outOfStockThreshold;
});

module.exports = mongoose.model('Inventory', inventorySchema);
