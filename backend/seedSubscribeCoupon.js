require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./src/models/coupon.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shoppilot';

const subscribeCoupon = {
  code: 'SUBSCRIBE15',
  discountType: 'percentage',
  discountValue: 15,
  validFrom: new Date(),
  validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 10)), // Valid for 10 years
  isActive: true,
  usageLimit: 100000
};

async function seedSubscribeCoupon() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Coupon.findOne({ code: subscribeCoupon.code });
    if (!existing) {
      await Coupon.create(subscribeCoupon);
      console.log(`Created coupon: ${subscribeCoupon.code}`);
    } else {
      console.log(`Coupon ${subscribeCoupon.code} already exists`);
    }

    console.log('Subscribe coupon seeded successfully!');
  } catch (error) {
    console.error('Error seeding coupon:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

seedSubscribeCoupon();
