const Vendor = require('../models/Vendor.model');
const User = require('../models/User.model');
const Order = require('../models/Order.model');
const OrderItem = require('../models/OrderItem.model');
const Product = require('../models/Product.model');

// @desc    Register a new vendor store
// @route   POST /api/vendors/register
// @access  Private (Users only)
exports.registerVendor = async (req, res, next) => {
  try {
    const { storeName, description, logo, banner } = req.body;

    // Check if user is already a vendor
    if (req.user.role === 'vendor' || req.user.role === 'admin' || req.user.role === 'super_admin') {
      return res.status(400).json({ success: false, message: 'You cannot register as a vendor with your current role' });
    }

    const existingVendor = await Vendor.findOne({ userId: req.user.id || req.user._id });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: 'You already have a registered store' });
    }

    const vendor = await Vendor.create({
      userId: req.user.id || req.user._id,
      storeName,
      description,
      logo,
      banner
    });

    // Update user role to vendor
    await User.findByIdAndUpdate(req.user.id || req.user._id, { role: 'vendor' });

    res.status(201).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get logged in vendor dashboard stats
// @route   GET /api/vendors/me
// @access  Private/Vendor
exports.getVendorDashboard = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id || req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    // Get product count
    const productCount = await Product.countDocuments({ vendorId: vendor._id, isDeleted: false });

    // Get recent orders containing items from this vendor
    const orderItems = await OrderItem.find({ vendorId: vendor._id })
      .populate('orderId')
      .sort('-createdAt')
      .limit(10);

    // Get sales trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const salesTrendsRaw = await OrderItem.aggregate([
      { 
        $match: { 
          vendorId: vendor._id,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$subtotal" },
          sales: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing dates
    const salesTrends = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const match = salesTrendsRaw.find(item => item._id === dateString);
      salesTrends.push({
        date: dateString,
        revenue: match ? match.revenue : 0,
        sales: match ? match.sales : 0
      });
    }

    // Get top products
    const topProductsRaw = await OrderItem.aggregate([
      { $match: { vendorId: vendor._id } },
      { 
        $group: {
          _id: "$productId",
          productTitle: { $first: "$productTitle" },
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$subtotal" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);
    
    const topProducts = topProductsRaw.map(p => ({
      name: p.productTitle,
      sales: p.totalQuantity,
      revenue: p.totalRevenue
    }));

    res.status(200).json({
      success: true,
      data: {
        vendor,
        stats: {
          productCount,
          totalSales: vendor.totalSales,
          totalRevenue: vendor.totalRevenue,
          balance: vendor.balance
        },
        recentOrderItems: orderItems,
        salesTrends,
        topProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get public vendor store
// @route   GET /api/vendors/store/:slug
// @access  Public
exports.getVendorStore = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ slug: req.params.slug, status: 'active' });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Store not found or inactive' });
    }

    // Get products for this store
    const products = await Product.find({ 
      vendorId: vendor._id, 
      isActive: true, 
      isDeleted: false 
    }).populate('categoryId brandId');

    res.status(200).json({
      success: true,
      data: {
        vendor,
        products
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get all vendors (Admin only)
// @route   GET /api/vendors
// @access  Private/Admin
exports.getVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find().populate('userId', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
