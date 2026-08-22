const subscriptionService = require('../services/subscription.service');

const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getSubscriptions(req.user.id);
    res.status(200).json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    console.error('Get Subscriptions Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch subscriptions'
    });
  }
};

const updateSubscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const subscription = await subscriptionService.updateSubscriptionStatus(req.user.id, req.params.id, status);
    res.status(200).json({
      success: true,
      message: `Subscription ${status}`,
      data: subscription
    });
  } catch (error) {
    console.error('Update Subscription Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update subscription status'
    });
  }
};

module.exports = {
  getSubscriptions,
  updateSubscriptionStatus
};
