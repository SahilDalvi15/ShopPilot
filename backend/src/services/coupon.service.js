const Coupon = require('../models/Coupon.model');
const logger = require('../utils/logger');

class CouponService {
  async getCoupons(query) {
    const { active } = query;

    const queryObj = { isDeleted: false };
    if (active !== undefined) {
      queryObj.isActive = active === 'true';
    }

    const coupons = await Coupon.find(queryObj)
      .populate('applicableCategories', 'name slug')
      .populate('applicableBrands', 'name slug')
      .populate('applicableProducts', 'title slug')
      .sort({ createdAt: -1 });

    return coupons.map(coupon => ({
      id: coupon._id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscountAmount: coupon.maxDiscountAmount,
      minOrderAmount: coupon.minOrderAmount,
      usageLimit: coupon.usageLimit,
      usageLimitPerUser: coupon.usageLimitPerUser,
      usedCount: coupon.usedCount,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      applicableCategories: coupon.applicableCategories,
      applicableBrands: coupon.applicableBrands,
      applicableProducts: coupon.applicableProducts,
      isActive: coupon.isActive,
      isValid: coupon.isValid,
      isExpired: coupon.isExpired,
      isUsageLimitReached: coupon.isUsageLimitReached
    }));
  }

  async createCoupon(couponData, userId) {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscountAmount,
      minOrderAmount,
      usageLimit,
      usageLimitPerUser,
      validFrom,
      validUntil,
      applicableCategories,
      applicableBrands,
      applicableProducts
    } = couponData;

    // Check if coupon with same code exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      const error = new Error('Coupon with this code already exists');
      error.statusCode = 409;
      error.code = 'COUPON_EXISTS';
      throw error;
    }

    // Validate dates
    if (new Date(validFrom) >= new Date(validUntil)) {
      const error = new Error('Valid until date must be after valid from date');
      error.statusCode = 400;
      error.code = 'INVALID_DATES';
      throw error;
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      maxDiscountAmount,
      minOrderAmount: minOrderAmount || 0,
      usageLimit,
      usageLimitPerUser: usageLimitPerUser || 1,
      validFrom,
      validUntil,
      applicableCategories: applicableCategories || [],
      applicableBrands: applicableBrands || [],
      applicableProducts: applicableProducts || [],
      createdBy: userId
    });

    logger.info(`Coupon ${coupon._id} created by user ${userId}`);

    return {
      id: coupon._id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscountAmount: coupon.maxDiscountAmount,
      minOrderAmount: coupon.minOrderAmount,
      usageLimit: coupon.usageLimit,
      usageLimitPerUser: coupon.usageLimitPerUser,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      applicableCategories: coupon.applicableCategories,
      applicableBrands: coupon.applicableBrands,
      applicableProducts: coupon.applicableProducts,
      isActive: coupon.isActive
    };
  }

  async updateCoupon(couponId, updateData) {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      const error = new Error('Coupon not found');
      error.statusCode = 404;
      error.code = 'COUPON_NOT_FOUND';
      throw error;
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'code') {
        coupon[key] = updateData[key];
      }
    });

    // Validate dates if both provided
    if (updateData.validFrom && updateData.validUntil) {
      if (new Date(updateData.validFrom) >= new Date(updateData.validUntil)) {
        const error = new Error('Valid until date must be after valid from date');
        error.statusCode = 400;
        error.code = 'INVALID_DATES';
        throw error;
      }
    }

    await coupon.save();

    logger.info(`Coupon ${couponId} updated`);

    return {
      id: coupon._id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscountAmount: coupon.maxDiscountAmount,
      minOrderAmount: coupon.minOrderAmount,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      isActive: coupon.isActive
    };
  }

  async deleteCoupon(couponId) {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      const error = new Error('Coupon not found');
      error.statusCode = 404;
      error.code = 'COUPON_NOT_FOUND';
      throw error;
    }

    coupon.isDeleted = true;
    await coupon.save();

    logger.info(`Coupon ${couponId} deleted`);
  }
}

module.exports = new CouponService();
