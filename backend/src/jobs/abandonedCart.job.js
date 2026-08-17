const cron = require('node-cron');
const Cart = require('../models/Cart.model');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

const startAbandonedCartJob = () => {
  // Run every 10 minutes (can be adjusted to every hour in production)
  cron.schedule('*/10 * * * *', async () => {
    logger.info('Running abandoned cart job...');
    
    try {
      // Find carts updated more than 2 hours ago (for testing, we'll use 2 minutes: 2 * 60 * 1000)
      // Actually, since we're setting up the foundation, let's set it to 2 hours realistically: 2 * 60 * 60 * 1000
      const thresholdTime = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago

      // Find carts where items array is not empty, it was updated before threshold time, and email hasn't been sent
      const abandonedCarts = await Cart.find({
        'items.0': { $exists: true },
        updatedAt: { $lt: thresholdTime },
        abandonedEmailSent: false
      }).populate('userId', 'email firstName lastName isActive');

      logger.info(`Found ${abandonedCarts.length} abandoned carts to process.`);

      for (const cart of abandonedCarts) {
        // Ensure user exists and is active
        if (!cart.userId || !cart.userId.isActive) continue;

        const user = cart.userId;
        const cartUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`;

        try {
          await emailService.sendAbandonedCartEmail(
            user.email,
            user.firstName || 'Shopper',
            cartUrl
          );

          // Mark as sent
          cart.abandonedEmailSent = true;
          // We save without triggering validation to bypass any other required checks if needed, but save() is fine here
          await cart.save();

          logger.info(`Abandoned cart email sent to ${user.email}`);
        } catch (error) {
          logger.error(`Failed to send abandoned cart email to ${user.email}: ${error.message}`);
        }
      }
    } catch (error) {
      logger.error(`Error running abandoned cart job: ${error.message}`);
    }
  });

  logger.info('Abandoned cart cron job started');
};

module.exports = startAbandonedCartJob;
