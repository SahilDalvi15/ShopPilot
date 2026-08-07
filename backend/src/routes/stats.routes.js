const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { getAdminStats } = require('../controllers/stats.controller');

// Admin Routes
router.get('/admin', authenticate, authorize(['admin', 'super_admin']), getAdminStats);

module.exports = router;
