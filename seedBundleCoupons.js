const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const Coupon = require('./backend/src/models/Coupon.model');
const connectDB = require('./backend/src/config/database');

const seedBundleCoupons = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected');

    const coupons = [
      {
        code: 'BUNDLE10',
        type: 'percentage',
        discount: 10,
        maxDiscount: 500,
        minOrderAmount: 0,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
        isActive: true,
        usageLimit: 10000,
        usedCount: 0,
        description: '10% off for 2 items bundle'
      },
      {
        code: 'BUNDLE15',
        type: 'percentage',
        discount: 15,
        maxDiscount: 1000,
        minOrderAmount: 0,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
        isActive: true,
        usageLimit: 10000,
        usedCount: 0,
        description: '15% off for 3 items bundle'
      },
      {
        code: 'BUNDLE25',
        type: 'percentage',
        discount: 25,
        maxDiscount: 2000,
        minOrderAmount: 0,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
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
