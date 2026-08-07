const statsService = require('../services/stats.service');

const getAdminStats = async (req, res) => {
  try {
    const stats = await statsService.getAdminStats();
    res.status(200).json({
      success: true,
      message: 'Admin stats retrieved successfully',
      data: stats
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve admin stats',
      error: { code: error.code || 'ADMIN_STATS_ERROR' }
    });
  }
};

module.exports = {
  getAdminStats
};
