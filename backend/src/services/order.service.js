const Order = require('../models/Order.model');
const OrderItem = require('../models/OrderItem.model');
const Cart = require('../models/Cart.model');
const Address = require('../models/Address.model');
const Product = require('../models/Product.model');
const Inventory = require('../models/Inventory.model');
const User = require('../models/User.model');
const logger = require('../utils/logger');
const emailService = require('./emailService');
const { emitToUser, emitToAdmins } = require('../config/socket');

class OrderService {
  async createOrder(userId, orderData) {
    const { shippingAddressId, billingAddressId, paymentMethod, couponCode } = orderData;

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      const error = new Error('Cart is empty');
      error.statusCode = 400;
      error.code = 'EMPTY_CART';
      throw error;
    }

    // Get addresses
    const shippingAddress = await Address.findOne({ _id: shippingAddressId, userId, isDeleted: false });
    if (!shippingAddress) {
      const error = new Error('Shipping address not found');
      error.statusCode = 404;
      error.code = 'ADDRESS_NOT_FOUND';
      throw error;
    }

    const billingAddress = billingAddressId 
      ? await Address.findOne({ _id: billingAddressId, userId, isDeleted: false })
      : shippingAddress;

    if (!billingAddress) {
      const error = new Error('Billing address not found');
      error.statusCode = 404;
      error.code = 'ADDRESS_NOT_FOUND';
      throw error;
    }

    // Verify stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        const error = new Error(`Insufficient stock for ${product?.title || 'product'}`);
        error.statusCode = 400;
        error.code = 'INSUFFICIENT_STOCK';
        throw error;
      }
    }

    // Calculate order totals
    const subtotal = cart.subtotal;
    const discount = cart.totalDiscount;
    const cartTotal = subtotal - discount;
    
    const shippingCharge = cartTotal >= 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18); // 18% tax on subtotal
    
    const totalAmount = cartTotal + shippingCharge + tax;

    // Create order
    const order = await Order.create({
      userId,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phoneNumber: shippingAddress.phoneNumber,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        country: shippingAddress.country,
        postalCode: shippingAddress.postalCode
      },
      billingAddress: {
        fullName: billingAddress.fullName,
        phoneNumber: billingAddress.phoneNumber,
        addressLine1: billingAddress.addressLine1,
        addressLine2: billingAddress.addressLine2,
        city: billingAddress.city,
        state: billingAddress.state,
        country: billingAddress.country,
        postalCode: billingAddress.postalCode
      },
      subtotal,
      discount,
      shippingCharge,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'mock' ? 'success' : 'pending',
      orderStatus: paymentMethod === 'mock' ? 'confirmed' : 'pending',
      ...(cart.appliedCoupon && cart.appliedCoupon.couponId && { coupon: cart.appliedCoupon }),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    // Create order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      const orderItem = await OrderItem.create({
        orderId: order._id,
        productId: item.productId._id,
        productTitle: product.title,
        productImage: product.images[0],
        brand: product.brandId,
        category: product.categoryId,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        price: item.price,
        discountedPrice: item.discountedPrice,
        discount: product.discount,
        specifications: product.specifications
      });
      orderItems.push(orderItem._id);

      // Update product sold count and stock
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { soldCount: item.quantity, stock: -item.quantity }
      });

      // Update inventory (skip if no inventory record exists)
      try {
        const inventoryRecord = await Inventory.findOneAndUpdate(
          { productId: item.productId._id },
          {
            $inc: { currentStock: -item.quantity },
            lastStockUpdate: new Date()
          }
        );

        if (inventoryRecord) {
          const InventoryLog = require('../models/InventoryLog.model');
          await InventoryLog.create({
            productId: item.productId._id,
            inventoryId: inventoryRecord._id,
            previousStock: product.stock,
            newStock: product.stock - item.quantity,
            changeType: 'sale',
            quantityChanged: item.quantity,
            referenceId: order._id,
            referenceType: 'order',
            performedBy: userId
          });
        }
      } catch (invErr) {
        logger.error(`Inventory update failed for product ${item.productId._id}: ${invErr.message}`);
      }
    }

    order.items = orderItems;
    await order.save();

    // Update coupon usage if applied (must read before clearing)
    if (cart.appliedCoupon && cart.appliedCoupon.couponId) {
      try {
        const Coupon = require('../models/Coupon.model');
        await Coupon.findByIdAndUpdate(cart.appliedCoupon.couponId, {
          $inc: { usedCount: 1 }
        });
      } catch (couponErr) {
        logger.error(`Coupon usage update failed: ${couponErr.message}`);
      }
    }

    // Clear cart
    cart.items = [];
    cart.appliedCoupon = null;
    await cart.save();

    // TODO: Create Razorpay order if payment method is razorpay
    let razorpayOrder = null;
    if (paymentMethod === 'razorpay') {
      // razorpayOrder = await createRazorpayOrder(order);
      logger.info(`Razorpay order would be created for order ${order._id}`);
    }

    // Send order confirmation email
    try {
      const user = await User.findById(userId);
      if (user) {
        const shippingAddressStr = `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}`;
        await emailService.sendOrderConfirmationEmail(user.email, `${user.firstName} ${user.lastName}`, {
          orderId: order.orderNumber,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          shippingAddress: shippingAddressStr,
        });
      }
    } catch (emailError) {
      logger.error(`Failed to send order confirmation email: ${emailError.message}`);
      // Don't fail order creation if email fails
    }

    // Emit real-time notification to user
    try {
      emitToUser(userId, 'order_created', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.orderStatus,
      });
    } catch (socketError) {
      logger.error(`Failed to emit order notification: ${socketError.message}`);
    }

    // Emit notification to admins
    try {
      emitToAdmins('new_order', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        userId,
        totalAmount: order.totalAmount,
        customerName: order.shippingAddress.fullName,
      });
    } catch (socketError) {
      logger.error(`Failed to emit admin notification: ${socketError.message}`);
    }

    logger.info(`Order ${order._id} created for user ${userId}`);

    return {
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        userId: order.userId,
        items: orderItems,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        subtotal: order.subtotal,
        discount: order.discount,
        shippingCharge: order.shippingCharge,
        tax: order.tax,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        estimatedDelivery: order.estimatedDelivery
      },
      razorpayOrder
    };
  }

  async getOrders(userId, query) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const queryObj = { userId };
    if (status) {
      queryObj.orderStatus = status;
    }

    const orders = await Order.find(queryObj)
      .populate('items')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(queryObj);

    const transformedOrders = orders.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      items: order.items.map(item => ({
        productId: item.productId,
        product: {
          title: item.productTitle,
          images: item.productImage ? [item.productImage] : []
        },
        quantity: item.quantity,
        price: item.price || item.discountedPrice,
        subtotal: item.subtotal
      })),
      shippingAddress: order.shippingAddress,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt
    }));

    return {
      orders: transformedOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1
      }
    };
  }

  async getOrderById(userId, orderId) {
    const order = await Order.findOne({ _id: orderId, userId })
      .populate('items')
      .populate('paymentId');

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }

    const transformedItems = await Promise.all(order.items.map(async (item) => {
      const product = await Product.findById(item.productId);
      return {
        id: item._id,
        productId: item.productId,
        productTitle: item.productTitle,
        productImage: item.productImage,
        brand: product?.brandId,
        category: product?.categoryId,
        quantity: item.quantity,
        price: item.price,
        discountedPrice: item.discountedPrice,
        discount: item.discount,
        subtotal: item.subtotal,
        specifications: item.specifications,
        isReturned: item.isReturned
      };
    }));

    return {
      id: order._id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      items: transformedItems,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      subtotal: order.subtotal,
      discount: order.discount,
      shippingCharge: order.shippingCharge,
      tax: order.tax,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentId: order.paymentId,
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      coupon: order.coupon,
      estimatedDelivery: order.estimatedDelivery,
      actualDelivery: order.actualDelivery,
      cancellationReason: order.cancellationReason,
      returnReason: order.returnReason,
      createdAt: order.createdAt
    };
  }

  async cancelOrder(userId, orderId, reason) {
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      const error = new Error('Order cannot be cancelled at this stage');
      error.statusCode = 400;
      error.code = 'CANNOT_CANCEL';
      throw error;
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: 'Order cancelled by user',
      updatedBy: userId
    });
    await order.save();

    // Restore inventory
    for (const itemId of order.items) {
      const orderItem = await OrderItem.findById(itemId);
      if (orderItem) {
        await Inventory.findOneAndUpdate(
          { productId: orderItem.productId },
          {
            $inc: { currentStock: orderItem.quantity },
            lastStockUpdate: new Date()
          }
        );

        // Log inventory change
        const InventoryLog = require('../models/InventoryLog.model');
        const inventory = await Inventory.findOne({ productId: orderItem.productId });
        await InventoryLog.create({
          productId: orderItem.productId,
          inventoryId: inventory._id,
          changeType: 'return',
          quantityChanged: orderItem.quantity,
          referenceId: order._id,
          referenceType: 'order',
          performedBy: userId,
          reason: 'Order cancelled'
        });

        // Update product sold count
        await Product.findByIdAndUpdate(orderItem.productId, {
          $inc: { soldCount: -orderItem.quantity }
        });
      }
    }

    logger.info(`Order ${orderId} cancelled by user ${userId}`);
  }
  async adminGetOrders(query) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const queryObj = {};
    if (status && status !== 'all') {
      queryObj.orderStatus = status.toLowerCase();
    }
    
    // We can't easily search across referenced collections in a standard find, 
    // but we can try to find users matching the search and then find their orders.
    if (search) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      });
      const userIds = users.map(u => u._id);
      queryObj.$or = [
        { userId: { $in: userIds } },
        { _id: search.length === 24 ? search : null } // Try exact order ID match if it's a valid ObjectId
      ].filter(cond => cond._id !== null || cond.userId);
    }

    const orders = await Order.find(queryObj)
      .populate('items')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(queryObj);

    const transformedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      user: order.userId ? {
        id: order.userId._id,
        name: `${order.userId.firstName || ''} ${order.userId.lastName || ''}`.trim(),
        email: order.userId.email
      } : null,
      items: order.items,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.orderStatus,
      createdAt: order.createdAt
    }));

    return {
      orders: transformedOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1
      }
    };
  }

  async adminUpdateOrderStatus(orderId, status, adminId) {
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }

    // Optional: Add logic to prevent certain state transitions

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: `Order status updated to ${status} by admin`,
      updatedBy: adminId
    });

    await order.save();

    // If order is cancelled by admin, restore inventory
    if (status === 'cancelled') {
      for (const itemId of order.items) {
        const orderItem = await OrderItem.findById(itemId);
        if (orderItem) {
          await Inventory.findOneAndUpdate(
            { productId: orderItem.productId },
            {
              $inc: { currentStock: orderItem.quantity },
              lastStockUpdate: new Date()
            }
          );
          
          await Product.findByIdAndUpdate(orderItem.productId, {
            $inc: { soldCount: -orderItem.quantity }
          });
        }
      }
    }

    // Emit event
    try {
      emitToUser(order.userId, 'order_updated', {
        orderId: order._id,
        status: order.orderStatus,
        message: `Your order status has been updated to ${status}`
      });
    } catch (err) {
      logger.error(`Failed to emit order update: ${err.message}`);
    }

    return order;
  }
}

module.exports = new OrderService();
