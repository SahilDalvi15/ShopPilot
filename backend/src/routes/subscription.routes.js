const router = require('express').Router();
const subscriptionController = require('../controllers/subscription.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.route('/')
  .get(subscriptionController.getSubscriptions);

router.route('/:id/status')
  .put(subscriptionController.updateSubscriptionStatus);

module.exports = router;
