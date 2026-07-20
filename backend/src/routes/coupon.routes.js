const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { getCoupons, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/coupon.controller');

router.get('/', getCoupons);
router.post('/', authenticate, authorize(['admin', 'super_admin']), createCoupon);
router.put('/:couponId', authenticate, authorize(['admin', 'super_admin']), updateCoupon);
router.delete('/:couponId', authenticate, authorize(['admin', 'super_admin']), deleteCoupon);

module.exports = router;
