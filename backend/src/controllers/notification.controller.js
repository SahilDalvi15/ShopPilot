const notificationService = require('../services/notification.service');

const getNotifications = async (req, res) => {
  try {
    const result = await notificationService.getNotifications(req.user.id, req.query);
    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: result.notifications,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve notifications',
      error: {
        code: error.code || 'GET_NOTIFICATIONS_ERROR'
      }
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    await notificationService.markAsRead(req.user.id, req.params.notificationId);
    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to mark notification as read',
      error: {
        code: error.code || 'MARK_READ_ERROR'
      }
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to mark all notifications as read',
      error: {
        code: error.code || 'MARK_ALL_READ_ERROR'
      }
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
