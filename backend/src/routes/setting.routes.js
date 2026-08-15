const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { getSettings, updateSettings } = require('../controllers/setting.controller');

// Public route to get settings (used for store name, currency, tax rules etc)
router.get('/', getSettings);

// Admin route to update settings
router.put('/', authenticate, authorize(['admin', 'super_admin']), updateSettings);

module.exports = router;
