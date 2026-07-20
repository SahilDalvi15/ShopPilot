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

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder
};
