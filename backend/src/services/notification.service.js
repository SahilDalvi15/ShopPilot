const Notification = require('../models/Notification.model');
const logger = require('../utils/logger');

class NotificationService {
  async getNotifications(userId, query) {
    const { page = 1, limit = 20, unreadOnly } = query;
    const skip = (page - 1) * limit;

    const queryObj = { userId };
    if (unreadOnly === 'true') {
      queryObj.isRead = false;
    }

    const notifications = await Notification.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(queryObj);

    const transformedNotifications = notifications.map(notification => ({
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      isRead: notification.isRead,
      readAt: notification.readAt,
      actionUrl: notification.actionUrl,
      priority: notification.priority,
      relatedId: notification.relatedId,
      relatedType: notification.relatedType,
      isExpired: notification.isExpired,
      createdAt: notification.createdAt
    }));

    return {
      notifications: transformedNotifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1
      }
    };
  }

  async markAsRead(userId, notificationId) {
    const notification = await Notification.findOne({ _id: notificationId, userId });

    if (!notification) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      error.code = 'NOTIFICATION_NOT_FOUND';
      throw error;
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    logger.info(`Notification ${notificationId} marked as read for user ${userId}`);
  }

  async markAllAsRead(userId) {
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    logger.info(`All notifications marked as read for user ${userId}`);
  }

  // Helper method to create notifications (can be called from other services)
  async createNotification(userId, notificationData) {
    const { type, title, message, data, actionUrl, priority, relatedId, relatedType, expiresAt } = notificationData;

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data: data || {},
      actionUrl,
      priority: priority || 'medium',
      relatedId,
      relatedType,
      expiresAt
    });

    logger.info(`Notification created for user ${userId}: ${title}`);

    return notification;
  }
}

module.exports = new NotificationService();
