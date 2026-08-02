const Order = require('../models/Order.model');
const OrderItem = require('../models/OrderItem.model');
const Cart = require('../models/Cart.model');
const Address = require('../models/Address.model');
const Product = require('../models/Product.model');
const Inventory = require('../models/Inventory.model');
const User = require('../models/User.model');
const logger = require('../utils/logger');
const emailService = require('./emailService');

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
    const shippingCharge = 0; // TODO: Calculate based on shipping logic
    const tax = 0; // TODO: Calculate based on tax logic
    const totalAmount = subtotal - discount + shippingCharge + tax;

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
      paymentStatus: 'pending',
      orderStatus: 'pending',
      coupon: cart.appliedCoupon,
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
        quantity: item.quantity,
        price: item.price,
        discountedPrice: item.discountedPrice,
        discount: product.discount,
        specifications: product.specifications
      });
      orderItems.push(orderItem._id);

      // Update product sold count
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { soldCount: item.quantity }
      });

      // Update inventory
      await Inventory.findOneAndUpdate(
        { productId: item.productId._id },
        {
          $inc: { currentStock: -item.quantity },
          lastStockUpdate: new Date()
        }
      );

      // Log inventory change
      const InventoryLog = require('../models/InventoryLog.model');
      await InventoryLog.create({
        productId: item.productId._id,
        inventoryId: (await Inventory.findOne({ productId: item.productId._id }))._id,
        previousStock: product.stock,
        newStock: product.stock - item.quantity,
        changeType: 'sale',
        quantityChanged: item.quantity,
        referenceId: order._id,
        referenceType: 'order',
        performedBy: userId
      });
    }

    order.items = orderItems;
    await order.save();

    // Clear cart
    cart.items = [];
    cart.appliedCoupon = null;
    await cart.save();

    // Update coupon usage if applied
    if (cart.appliedCoupon) {
      await Coupon.findByIdAndUpdate(cart.appliedCoupon.couponId, {
        $inc: { usedCount: 1 }
      });
    }

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
        productTitle: item.productTitle,
        productImage: item.productImage,
        quantity: item.quantity,
        subtotal: item.subtotal
      })),
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
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
}

module.exports = new OrderService();
