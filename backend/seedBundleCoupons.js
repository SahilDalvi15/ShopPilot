const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Coupon = require('./src/models/Coupon.model');
const connectDB = require('./src/config/database');

const seedBundleCoupons = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected');

    const coupons = [
      {
        code: 'BUNDLE10',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscountAmount: 500,
        minOrderAmount: 0,
        validFrom: new Date(),
        validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
        isActive: true,
        usageLimit: 10000,
        usedCount: 0,
        description: '10% off for 2 items bundle'
      },
      {
        code: 'BUNDLE15',
        discountType: 'percentage',
        discountValue: 15,
        maxDiscountAmount: 1000,
        minOrderAmount: 0,
        validFrom: new Date(),
        validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
        isActive: true,
        usageLimit: 10000,
        usedCount: 0,
        description: '15% off for 3 items bundle'
      },
      {
        code: 'BUNDLE25',
        discountType: 'percentage',
        discountValue: 25,
        maxDiscountAmount: 2000,
        minOrderAmount: 0,
        validFrom: new Date(),
        validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
        isActive: true,
        usageLimit: 10000,
        usedCount: 0,
        description: '25% off for 4+ items bundle'
      }
    ];

    for (const couponData of coupons) {
      const existing = await Coupon.findOne({ code: couponData.code });
      if (!existing) {
        await Coupon.create(couponData);
        console.log(`Created coupon ${couponData.code}`);
      } else {
        console.log(`Coupon ${couponData.code} already exists`);
      }
    }

    console.log('Bundle coupons seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding bundle coupons:', error);
    process.exit(1);
  }
};

seedBundleCoupons();
