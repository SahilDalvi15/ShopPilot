require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./src/models/coupon.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shoppilot';

const spinCoupons = [
  {
    code: 'SPIN5',
    discountType: 'percentage',
    discountValue: 5,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Valid for 1 year
    isActive: true,
    usageLimit: 1000
  },
  {
    code: 'SPIN10',
    discountType: 'percentage',
    discountValue: 10,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    isActive: true,
    usageLimit: 1000
  },
  {
    code: 'SPIN15',
    discountType: 'percentage',
    discountValue: 15,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    isActive: true,
    usageLimit: 1000
  },
  {
    code: 'SPIN20',
    discountType: 'percentage',
    discountValue: 20,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    isActive: true,
    usageLimit: 1000
  }
];

async function seedSpinCoupons() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const coupon of spinCoupons) {
      const existing = await Coupon.findOne({ code: coupon.code });
      if (!existing) {
        await Coupon.create(coupon);
        console.log(`Created coupon: ${coupon.code}`);
      } else {
        console.log(`Coupon ${coupon.code} already exists`);
      }
    }

    console.log('Spin coupons seeded successfully!');
  } catch (error) {
    console.error('Error seeding coupons:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

seedSpinCoupons();
