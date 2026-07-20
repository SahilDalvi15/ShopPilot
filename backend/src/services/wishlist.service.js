const Wishlist = require('../models/Wishlist.model');
const Product = require('../models/Product.model');
const Cart = require('../models/Cart.model');
const logger = require('../utils/logger');

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ userId }).populate('items.productId');

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, items: [] });
    }

    // Transform items with product details
    const transformedItems = wishlist.items
      .filter(item => item.productId && item.productId.isActive && !item.productId.isDeleted)
      .map(item => ({
        productId: item.productId._id,
        product: {
          id: item.productId._id,
          title: item.productId.title,
          slug: item.productId.slug,
          images: item.productId.images,
          price: item.productId.price,
          discount: item.productId.discount,
          discountedPrice: item.productId.discountedPrice,
          stock: item.productId.stock,
          rating: item.productId.rating
        },
        addedAt: item.addedAt
      }));

    return {
      id: wishlist._id,
      userId: wishlist.userId,
      items: transformedItems
    };
  }

  async addToWishlist(userId, productId) {
    // Verify product exists and is active
    const product = await Product.findOne({ _id: productId, isActive: true, isDeleted: false });
    if (!product) {
      const error = new Error('Product not found or unavailable');
      error.statusCode = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, items: [] });
    }

    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      const error = new Error('Item already in wishlist');
      error.statusCode = 409;
      error.code = 'ALREADY_IN_WISHLIST';
      throw error;
    }

    // Add item to wishlist
    wishlist.items.push({
      productId,
      addedAt: new Date()
    });

    await wishlist.save();

    logger.info(`Product ${productId} added to wishlist for user ${userId}`);

    return {
      productId,
      addedAt: new Date()
    };
  }

  async removeFromWishlist(userId, productId) {
    const wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      const error = new Error('Wishlist not found');
      error.statusCode = 404;
      error.code = 'WISHLIST_NOT_FOUND';
      throw error;
    }

    const itemIndex = wishlist.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      const error = new Error('Item not found in wishlist');
      error.statusCode = 404;
      error.code = 'ITEM_NOT_FOUND';
      throw error;
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    logger.info(`Item ${productId} removed from wishlist for user ${userId}`);
  }

  async moveToCart(userId, productId) {
    const wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      const error = new Error('Wishlist not found');
      error.statusCode = 404;
      error.code = 'WISHLIST_NOT_FOUND';
      throw error;
    }

    const itemIndex = wishlist.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      const error = new Error('Item not found in wishlist');
      error.statusCode = 404;
      error.code = 'ITEM_NOT_FOUND';
      throw error;
    }

    // Remove from wishlist
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    // Add to cart using cart service
    const cartService = require('./cart.service');
    const result = await cartService.addToCart(userId, { productId, quantity: 1 });

    logger.info(`Item ${productId} moved from wishlist to cart for user ${userId}`);

    return result;
  }
}

module.exports = new WishlistService();
