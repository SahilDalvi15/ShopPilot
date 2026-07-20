const couponService = require('../services/coupon.service');

const getCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getCoupons(req.query);
    res.status(200).json({
      success: true,
      message: 'Coupons retrieved successfully',
      data: coupons
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve coupons',
      error: {
        code: error.code || 'GET_COUPONS_ERROR'
      }
    });
  }
};

const createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create coupon',
      error: {
        code: error.code || 'CREATE_COUPON_ERROR'
      }
    });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.couponId, req.body);
    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update coupon',
      error: {
        code: error.code || 'UPDATE_COUPON_ERROR'
      }
    });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await couponService.deleteCoupon(req.params.couponId);
    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete coupon',
      error: {
        code: error.code || 'DELETE_COUPON_ERROR'
      }
    });
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
