const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');

class StatsService {
  async getAdminStats() {
    // 1. Total Revenue (sum of totalAmount for all non-cancelled orders)
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // 2. Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Total Products (active)
    const totalProducts = await Product.countDocuments({ isDeleted: false, isActive: true });

    // 4. Total Users (excluding admins and super_admins)
    const totalUsers = await User.countDocuments({ 
      isDeleted: false, 
      role: { $nin: ['admin', 'super_admin'] } 
    });

    // 5. Recent Orders (latest 5)
    const recentOrdersRaw = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'firstName lastName');

    const recentOrders = recentOrdersRaw.map(order => ({
      id: order.orderNumber,
      customer: order.userId ? `${order.userId.firstName} ${order.userId.lastName}`.trim() : 'Unknown',
      amount: `₹${order.totalAmount.toLocaleString()}`,
      status: order.orderStatus,
      // Simple relative time calculation (you could use moment.js or date-fns in production)
      date: order.createdAt
    }));

    // 6. Top Products (by soldCount)
    const topProductsRaw = await Product.find({ isDeleted: false })
      .sort({ soldCount: -1 })
      .limit(5)
      .select('title soldCount price');

    const topProducts = topProductsRaw.map(product => ({
      name: product.title,
      sales: product.soldCount || 0,
      revenue: `₹${((product.soldCount || 0) * product.price).toLocaleString()}`
    }));

    return {
      overview: {
        totalRevenue: `₹${totalRevenue.toLocaleString()}`,
        totalOrders: totalOrders.toLocaleString(),
        totalProducts: totalProducts.toLocaleString(),
        totalUsers: totalUsers.toLocaleString()
      },
      recentOrders,
      topProducts
    };
  }
}

module.exports = new StatsService();
