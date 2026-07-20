const cartService = require('../services/cart.service');

const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: cart
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve cart',
      error: {
        code: error.code || 'GET_CART_ERROR'
      }
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const result = await cartService.addToCart(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to add item to cart',
      error: {
        code: error.code || 'ADD_TO_CART_ERROR'
      }
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const result = await cartService.updateCartItem(req.user.id, req.params.productId, req.body);
    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update cart item',
      error: {
        code: error.code || 'UPDATE_CART_ITEM_ERROR'
      }
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const result = await cartService.removeFromCart(req.user.id, req.params.productId);
    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to remove item from cart',
      error: {
        code: error.code || 'REMOVE_FROM_CART_ERROR'
      }
    });
  }
};

const clearCart = async (req, res) => {
  try {
    await cartService.clearCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to clear cart',
      error: {
        code: error.code || 'CLEAR_CART_ERROR'
      }
    });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const result = await cartService.applyCoupon(req.user.id, req.body.code);
    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to apply coupon',
      error: {
        code: error.code || 'APPLY_COUPON_ERROR'
      }
    });
  }
};

const removeCoupon = async (req, res) => {
  try {
    const result = await cartService.removeCoupon(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Coupon removed successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to remove coupon',
      error: {
        code: error.code || 'REMOVE_COUPON_ERROR'
      }
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon
};
