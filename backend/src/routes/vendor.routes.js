const express = require('express');
const {
  registerVendor,
  getVendorDashboard,
  getVendorStore,
  getVendors
} = require('../controllers/vendor.controller');

const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.get('/store/:slug', getVendorStore);

// Protected routes (Admin only)
router.get('/', authenticate, authorize('admin', 'super_admin'), getVendors);

// Protected routes (User/Vendor)
router.post('/register', authenticate, registerVendor);
router.get('/me', authenticate, authorize('vendor'), getVendorDashboard);

module.exports = router;
