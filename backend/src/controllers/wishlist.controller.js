const wishlistService = require('../services/wishlist.service');

const getWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Wishlist retrieved successfully',
      data: wishlist
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve wishlist',
      error: {
        code: error.code || 'GET_WISHLIST_ERROR'
      }
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const result = await wishlistService.addToWishlist(req.user.id, req.body.productId);
    res.status(201).json({
      success: true,
      message: 'Item added to wishlist successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to add item to wishlist',
      error: {
        code: error.code || 'ADD_TO_WISHLIST_ERROR'
      }
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await wishlistService.removeFromWishlist(req.user.id, req.params.productId);
    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to remove item from wishlist',
      error: {
        code: error.code || 'REMOVE_FROM_WISHLIST_ERROR'
      }
    });
  }
};

const moveToCart = async (req, res) => {
  try {
    const result = await wishlistService.moveToCart(req.user.id, req.params.productId);
    res.status(200).json({
      success: true,
      message: 'Item moved to cart successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to move item to cart',
      error: {
        code: error.code || 'MOVE_TO_CART_ERROR'
      }
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart
};
