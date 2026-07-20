const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
const Coupon = require('../models/Coupon.model');
const logger = require('../utils/logger');

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Transform items with product details
    const transformedItems = cart.items.map(item => {
      if (!item.productId) return null;
      
      return {
        productId: item.productId._id,
        product: {
          id: item.productId._id,
          title: item.productId.title,
          slug: item.productId.slug,
          images: item.productId.images,
          price: item.productId.price,
          discount: item.productId.discount,
          discountedPrice: item.productId.discountedPrice,
          stock: item.productId.stock
        },
        quantity: item.quantity,
        price: item.price,
        discountedPrice: item.discountedPrice,
        subtotal: item.price * item.quantity
      };
    }).filter(item => item !== null);

    return {
      id: cart._id,
      userId: cart.userId,
      items: transformedItems,
      appliedCoupon: cart.appliedCoupon,
      subtotal: cart.subtotal,
      totalDiscount: cart.totalDiscount,
      totalAmount: cart.totalAmount
    };
  }

  async addToCart(userId, { productId, quantity = 1 }) {
    // Verify product exists and is active
    const product = await Product.findOne({ _id: productId, isActive: true, isDeleted: false });
    if (!product) {
      const error = new Error('Product not found or unavailable');
      error.statusCode = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    // Check stock
    if (product.stock < quantity) {
      const error = new Error('Insufficient stock');
      error.statusCode = 400;
      error.code = 'INSUFFICIENT_STOCK';
      throw error;
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = product.price;
      cart.items[existingItemIndex].discountedPrice = product.discountedPrice;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        price: product.price,
        discountedPrice: product.discountedPrice
      });
    }

    await cart.save();

    // Recalculate totals
    await cart.save();

    logger.info(`Product ${productId} added to cart for user ${userId}`);

    return {
      item: {
        productId,
        quantity,
        price: product.price,
        discountedPrice: product.discountedPrice,
        subtotal: product.discountedPrice * quantity
      },
      cart: {
        subtotal: cart.subtotal,
        totalDiscount: cart.totalDiscount,
        totalAmount: cart.totalAmount
      }
    };
  }

  async updateCartItem(userId, productId, { quantity }) {
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      error.code = 'CART_NOT_FOUND';
      throw error;
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      const error = new Error('Item not found in cart');
      error.statusCode = 404;
      error.code = 'ITEM_NOT_FOUND';
      throw error;
    }

    // Verify product exists and check stock
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      const error = new Error('Insufficient stock');
      error.statusCode = 400;
      error.code = 'INSUFFICIENT_STOCK';
      throw error;
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;
    cart.items[itemIndex].discountedPrice = product.discountedPrice;

    await cart.save();

    logger.info(`Cart item ${productId} updated for user ${userId}`);

    return {
      item: {
        productId,
        quantity,
        price: product.price,
        discountedPrice: product.discountedPrice,
        subtotal: product.discountedPrice * quantity
      },
      cart: {
        subtotal: cart.subtotal,
        totalDiscount: cart.totalDiscount,
        totalAmount: cart.totalAmount
      }
    };
  }

  async removeFromCart(userId, productId) {
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      error.code = 'CART_NOT_FOUND';
      throw error;
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      const error = new Error('Item not found in cart');
      error.statusCode = 404;
      error.code = 'ITEM_NOT_FOUND';
      throw error;
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    logger.info(`Item ${productId} removed from cart for user ${userId}`);

    return {
      subtotal: cart.subtotal,
      totalDiscount: cart.totalDiscount,
      totalAmount: cart.totalAmount
    };
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      error.code = 'CART_NOT_FOUND';
      throw error;
    }

    cart.items = [];
    cart.appliedCoupon = null;
    await cart.save();

    logger.info(`Cart cleared for user ${userId}`);
  }

  async applyCoupon(userId, code) {
    const cart = await Cart.findOne({ userId });
    
    if (!cart || cart.items.length === 0) {
      const error = new Error('Cart is empty');
      error.statusCode = 400;
      error.code = 'EMPTY_CART';
      throw error;
    }

    // Find coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      isDeleted: false
    });

    if (!coupon) {
      const error = new Error('Invalid coupon code');
      error.statusCode = 404;
      error.code = 'INVALID_COUPON';
      throw error;
    }

    // Check if coupon is valid
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      const error = new Error('Coupon is expired or not yet valid');
      error.statusCode = 400;
      error.code = 'COUPON_EXPIRED';
      throw error;
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      const error = new Error('Coupon usage limit reached');
      error.statusCode = 400;
      error.code = 'COUPON_LIMIT_REACHED';
      throw error;
    }

    // Check minimum order amount
    if (cart.subtotal < coupon.minOrderAmount) {
      const error = new Error(`Minimum order amount ${coupon.minOrderAmount} required`);
      error.statusCode = 400;
      error.code = 'MIN_ORDER_NOT_MET';
      throw error;
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cart.subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Apply coupon
    cart.appliedCoupon = {
      couponId: coupon._id,
      code: coupon.code,
      discountAmount
    };

    await cart.save();

    logger.info(`Coupon ${code} applied for user ${userId}`);

    return {
      appliedCoupon: cart.appliedCoupon,
      cart: {
        subtotal: cart.subtotal,
        totalDiscount: cart.totalDiscount,
        totalAmount: cart.totalAmount
      }
    };
  }

  async removeCoupon(userId) {
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      error.code = 'CART_NOT_FOUND';
      throw error;
    }

    cart.appliedCoupon = null;
    await cart.save();

    logger.info(`Coupon removed for user ${userId}`);

    return {
      subtotal: cart.subtotal,
      totalDiscount: cart.totalDiscount,
      totalAmount: cart.totalAmount
    };
  }
}

module.exports = new CartService();
