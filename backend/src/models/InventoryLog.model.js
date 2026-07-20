const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Product ID is required'],
    ref: 'Product',
    index: true
  },
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Inventory ID is required'],
    ref: 'Inventory'
  },
  previousStock: Number,
  newStock: Number,
  changeType: {
    type: String,
    enum: ['restock', 'sale', 'return', 'adjustment', 'damage'],
    required: [true, 'Change type is required']
  },
  quantityChanged: {
    type: Number,
    required: [true, 'Quantity changed is required']
  },
  reason: String,
  referenceId: mongoose.Schema.Types.ObjectId,
  referenceType: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, {
  timestamps: true
});

// Indexes
inventoryLogSchema.index({ productId: 1 });
inventoryLogSchema.index({ inventoryId: 1 });
inventoryLogSchema.index({ changeType: 1 });
inventoryLogSchema.index({ createdAt: -1 });
inventoryLogSchema.index({ productId: 1, changeType: 1 });

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
