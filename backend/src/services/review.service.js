const Review = require('../models/Review.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const logger = require('../utils/logger');

class ReviewService {
  async getProductReviews(productId, query) {
    const { page = 1, limit = 10, rating } = query;
    const skip = (page - 1) * limit;

    const queryObj = { productId, isDeleted: false };
    if (rating) {
      queryObj.rating = parseInt(rating);
    }

    const reviews = await Review.find(queryObj)
      .populate('userId', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(queryObj);

    const transformedReviews = reviews.map(review => ({
      id: review._id,
      productId: review.productId,
      user: {
        id: review.userId._id,
        firstName: review.userId.firstName,
        lastName: review.userId.lastName,
        profilePicture: review.userId.profilePicture
      },
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images,
      isVerifiedPurchase: review.isVerifiedPurchase,
      helpfulCount: review.helpfulCount,
      notHelpfulCount: review.notHelpfulCount,
      isAdminResponse: review.isAdminResponse,
      adminResponse: review.adminResponse,
      adminResponseAt: review.adminResponseAt,
      createdAt: review.createdAt
    }));

    return {
      reviews: transformedReviews,
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

  async getAllReviews(query) {
    const { page = 1, limit = 20, rating, status } = query;
    const skip = (page - 1) * limit;

    const queryObj = { isDeleted: false };
    if (rating) {
      queryObj.rating = parseInt(rating);
    }

    const reviews = await Review.find(queryObj)
      .populate('userId', 'firstName lastName profilePicture email')
      .populate('productId', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(queryObj);

    const transformedReviews = reviews.map(review => ({
      id: review._id,
      productId: review.productId?._id,
      productTitle: review.productId?.title,
      productImage: review.productId?.images?.[0],
      user: {
        id: review.userId?._id,
        firstName: review.userId?.firstName,
        lastName: review.userId?.lastName,
        email: review.userId?.email,
        profilePicture: review.userId?.profilePicture
      },
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images,
      isVerifiedPurchase: review.isVerifiedPurchase,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt
    }));

    return {
      reviews: transformedReviews,
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

  async createReview(userId, reviewData) {
    const { productId, rating, title, comment, images, orderId } = reviewData;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      const error = new Error('You have already reviewed this product');
      error.statusCode = 409;
      error.code = 'ALREADY_REVIEWED';
      throw error;
    }

    // Check if user has purchased the product (if orderId provided)
    let isVerifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({ _id: orderId, userId });
      if (order && order.paymentStatus === 'success') {
        // Check if product is in order items
        const OrderItem = require('../models/OrderItem.model');
        const orderItem = await OrderItem.findOne({ orderId, productId });
        if (orderItem) {
          isVerifiedPurchase = true;
        }
      }
    }

    // Create review
    const review = await Review.create({
      productId,
      userId,
      orderId,
      rating,
      title,
      comment,
      images: images || [],
      isVerifiedPurchase
    });

    // Update product rating and review count
    const allReviews = await Review.find({ productId, isDeleted: false });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    logger.info(`Review created for product ${productId} by user ${userId}`);

    return {
      id: review._id,
      productId: review.productId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images,
      isVerifiedPurchase: review.isVerifiedPurchase,
      createdAt: review.createdAt
    };
  }

  async updateReview(userId, reviewId, updateData) {
    const review = await Review.findOne({ _id: reviewId, userId });

    if (!review) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      error.code = 'REVIEW_NOT_FOUND';
      throw error;
    }

    // Update allowed fields
    const allowedFields = ['rating', 'title', 'comment', 'images'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        review[field] = updateData[field];
      }
    });

    await review.save();

    // Update product rating
    const allReviews = await Review.find({ productId: review.productId, isDeleted: false });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await Product.findByIdAndUpdate(review.productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    logger.info(`Review ${reviewId} updated by user ${userId}`);

    return {
      id: review._id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images
    };
  }

  async deleteReview(userId, reviewId) {
    const review = await Review.findOne({ _id: reviewId, userId });

    if (!review) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      error.code = 'REVIEW_NOT_FOUND';
      throw error;
    }

    review.isDeleted = true;
    await review.save();

    // Update product rating
    const allReviews = await Review.find({ productId: review.productId, isDeleted: false });
    const avgRating = allReviews.length > 0 
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
      : 0;
    
    await Product.findByIdAndUpdate(review.productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    logger.info(`Review ${reviewId} deleted by user ${userId}`);
  }

  async markHelpful(userId, reviewId, helpful) {
    const review = await Review.findById(reviewId);

    if (!review) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      error.code = 'REVIEW_NOT_FOUND';
      throw error;
    }

    if (helpful) {
      review.helpfulCount += 1;
    } else {
      review.notHelpfulCount += 1;
    }

    await review.save();

    logger.info(`Review ${reviewId} marked as ${helpful ? 'helpful' : 'not helpful'} by user ${userId}`);
  }
}

module.exports = new ReviewService();
