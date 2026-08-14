const orderService = require('../services/order.service');

const createOrder = async (req, res) => {
  try {
    const result = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: result
    });
  } catch (error) {
    console.error('CREATE ORDER ERROR:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create order',
      error: {
        code: error.code || 'CREATE_ORDER_ERROR'
      }
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await orderService.getOrders(req.user.id, req.query);
    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: result.orders,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve orders',
      error: {
        code: error.code || 'GET_ORDERS_ERROR'
      }
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.user.id, req.params.orderId);
    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve order',
      error: {
        code: error.code || 'GET_ORDER_ERROR'
      }
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    await orderService.cancelOrder(req.user.id, req.params.orderId, req.body.reason);
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to cancel order',
      error: {
        code: error.code || 'CANCEL_ORDER_ERROR'
      }
    });
  }
};

const adminGetOrders = async (req, res) => {
  try {
    const result = await orderService.adminGetOrders(req.query);
    res.status(200).json({
      success: true,
      message: 'All orders retrieved successfully',
      data: result.orders,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve all orders',
      error: {
        code: error.code || 'ADMIN_GET_ORDERS_ERROR'
      }
    });
  }
};

const adminUpdateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.adminUpdateOrderStatus(
      req.params.orderId,
      req.body.status,
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update order status',
      error: {
        code: error.code || 'ADMIN_UPDATE_ORDER_STATUS_ERROR'
      }
    });
  }
};

const Order = require('../models/Order.model');
const User = require('../models/User.model');
const { generateInvoice } = require('../utils/pdfGenerator');

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user.id }).populate('items');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const user = await User.findById(req.user.id);
    
    // We pass the mongoose order and user doc to our PDF generator
    generateInvoice(order, user, res);
    
    // Note: We don't send a JSON response because the response is the PDF stream itself.
  } catch (error) {
    console.error('Invoice Generation Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to generate invoice' });
    }
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  adminGetOrders,
  adminUpdateOrderStatus,
  downloadInvoice
};
