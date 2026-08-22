const Subscription = require('../models/Subscription.model');
const logger = require('../utils/logger');

class SubscriptionService {
  async getSubscriptions(userId) {
    const subscriptions = await Subscription.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    return subscriptions.map(sub => ({
      id: sub._id,
      frequency: sub.frequency,
      status: sub.status,
      nextDeliveryDate: sub.nextDeliveryDate,
      totalAmount: sub.totalAmount,
      discountApplied: sub.discountApplied,
      items: sub.items.map(item => ({
        id: item._id,
        productId: item.productId,
        title: item.productTitle,
        image: item.productImage,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: sub.shippingAddress,
      paymentMethod: sub.paymentMethod,
      createdAt: sub.createdAt
    }));
  }

  async updateSubscriptionStatus(userId, subscriptionId, status) {
    if (!['active', 'paused', 'cancelled'].includes(status)) {
      const error = new Error('Invalid status');
      error.statusCode = 400;
      throw error;
    }

    const subscription = await Subscription.findOne({ _id: subscriptionId, userId });
    
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    subscription.status = status;
    await subscription.save();

    logger.info(`Subscription ${subscriptionId} status updated to ${status} by user ${userId}`);
    return subscription;
  }
}

module.exports = new SubscriptionService();
