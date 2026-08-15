const Product = require('../models/Product.model');
const Brand = require('../models/Brand.model');
const Category = require('../models/Category.model');
const Inventory = require('../models/Inventory.model');
const OrderItem = require('../models/OrderItem.model');
const logger = require('../utils/logger');
const elasticsearch = require('../config/elasticsearch');
const mongoose = require('mongoose');

class ProductService {
  async getProducts(query) {
    const {
      page = 1,
      limit = 10,
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isDeal,
      minRating,
      inStock
    } = query;

    const skip = (page - 1) * limit;
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Build query
    const queryObj = {
      isActive: true,
      isDeleted: false
    };

    if (category) {
      queryObj.categoryId = { $in: category.split(',') };
    }

    if (brand) {
      queryObj.brandId = { $in: brand.split(',') };
    }

    if (search) {
      queryObj.$text = { $search: search };
    }

    if ((minPrice !== undefined && minPrice !== '') || (maxPrice !== undefined && maxPrice !== '')) {
      queryObj.discountedPrice = {};
      if (minPrice !== undefined && minPrice !== '') {
        queryObj.discountedPrice.$gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        queryObj.discountedPrice.$lte = parseFloat(maxPrice);
      }
    }

    if (isDeal === 'true') {
      queryObj.discount = { $gt: 0 };
    }

    if (minRating) {
      queryObj.rating = { $gte: parseFloat(minRating) };
    }

    if (inStock === 'true') {
      queryObj.stock = { $gt: 0 };
    }

    // Get products
    const products = await Product.find(queryObj)
      .populate('brandId', 'name slug logo')
      .populate('categoryId', 'name slug image')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Product.countDocuments(queryObj);

    // Transform products
    const transformedProducts = products.map(product => ({
      id: product._id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      brand: product.brandId ? {
        id: product.brandId._id,
        name: product.brandId.name,
        slug: product.brandId.slug,
        logo: product.brandId.logo
      } : null,
      category: product.categoryId ? {
        id: product.categoryId._id,
        name: product.categoryId.name,
        slug: product.categoryId.slug,
        image: product.categoryId.image
      } : null,
      images: product.images,
      price: product.price,
      discount: product.discount,
      discountedPrice: product.discountedPrice,
      currency: product.currency,
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      soldCount: product.soldCount,
      isFeatured: product.isFeatured,
      specifications: product.specifications,
      tags: product.tags
    }));

    return {
      products: transformedProducts,
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

  async getProductBySlug(slug) {
    const product = await Product.findOne({ slug, isActive: true, isDeleted: false })
      .populate('brandId', 'name slug logo website')
      .populate('categoryId', 'name slug image description');

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    return {
      id: product._id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      brand: {
        id: product.brandId._id,
        name: product.brandId.name,
        slug: product.brandId.slug,
        logo: product.brandId.logo,
        website: product.brandId.website
      },
      category: {
        id: product.categoryId._id,
        name: product.categoryId.name,
        slug: product.categoryId.slug,
        image: product.categoryId.image,
        description: product.categoryId.description
      },
      images: product.images,
      price: product.price,
      discount: product.discount,
      discountedPrice: product.discountedPrice,
      currency: product.currency,
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      soldCount: product.soldCount,
      viewCount: product.viewCount,
      isFeatured: product.isFeatured,
      specifications: product.specifications,
      tags: product.tags,
      createdAt: product.createdAt
    };
  }

  async createProduct(productData, userId) {
    const {
      title,
      description,
      shortDescription,
      brandId,
      categoryId,
      images,
      price,
      discount,
      stock,
      specifications,
      tags,
      isFeatured
    } = productData;

    // Verify brand exists
    const brand = await Brand.findById(brandId);
    if (!brand) {
      const error = new Error('Brand not found');
      error.statusCode = 404;
      error.code = 'BRAND_NOT_FOUND';
      throw error;
    }

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      error.code = 'CATEGORY_NOT_FOUND';
      throw error;
    }

    // Generate slug
    const slugify = require('slugify');
    const slug = slugify(title, { lower: true });

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      const error = new Error('Product with this slug already exists');
      error.statusCode = 409;
      error.code = 'SLUG_EXISTS';
      throw error;
    }

    // Create product
    const product = await Product.create({
      title,
      slug,
      description,
      shortDescription,
      brandId,
      categoryId,
      images,
      price,
      discount: discount || 0,
      stock: stock || 0,
      specifications: specifications || {},
      tags: tags || [],
      isFeatured: isFeatured || false,
      createdBy: userId
    });

    // Create inventory record
    await Inventory.create({
      productId: product._id,
      currentStock: stock || 0
    });

    // Index product in Elasticsearch
    try {
      await elasticsearch.indexProduct(product);
    } catch (error) {
      logger.error(`Failed to index product in Elasticsearch: ${error.message}`);
    }

    logger.info(`Product ${product._id} created by user ${userId}`);

    return {
      id: product._id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      brandId: product.brandId,
      categoryId: product.categoryId,
      images: product.images,
      price: product.price,
      discount: product.discount,
      discountedPrice: product.discountedPrice,
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      soldCount: product.soldCount,
      isFeatured: product.isFeatured,
      specifications: product.specifications,
      tags: product.tags,
      isActive: product.isActive
    };
  }

  async updateProduct(productId, updateData, userId) {
    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'brandId' && key !== 'categoryId') {
        product[key] = updateData[key];
      }
    });

    // Handle brand/category updates if provided
    if (updateData.brandId) {
      const brand = await Brand.findById(updateData.brandId);
      if (!brand) {
        const error = new Error('Brand not found');
        error.statusCode = 404;
        error.code = 'BRAND_NOT_FOUND';
        throw error;
      }
      product.brandId = updateData.brandId;
    }

    if (updateData.categoryId) {
      const category = await Category.findById(updateData.categoryId);
      if (!category) {
        const error = new Error('Category not found');
        error.statusCode = 404;
        error.code = 'CATEGORY_NOT_FOUND';
        throw error;
      }
      product.categoryId = updateData.categoryId;
    }

    // Regenerate slug if title changed
    if (updateData.title && updateData.title !== product.title) {
      const slugify = require('slugify');
      product.slug = slugify(updateData.title, { lower: true });
    }

    product.updatedBy = userId;
    await product.save();

    // Update inventory if stock changed
    if (updateData.stock !== undefined) {
      await Inventory.findOneAndUpdate(
        { productId },
        { currentStock: updateData.stock, lastStockUpdate: new Date() }
      );
    }

    // Update Elasticsearch index
    try {
      await elasticsearch.indexProduct(product);
    } catch (error) {
      logger.error(`Failed to update product in Elasticsearch: ${error.message}`);
    }

    logger.info(`Product ${productId} updated by user ${userId}`);

    return {
      id: product._id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discount: product.discount,
      discountedPrice: product.discountedPrice,
      stock: product.stock
    };
  }

  async deleteProduct(productId) {
    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    product.isDeleted = true;
    await product.save();

    // Delete from Elasticsearch
    try {
      await elasticsearch.deleteProduct(productId);
    } catch (error) {
      logger.error(`Failed to delete product from Elasticsearch: ${error.message}`);
    }

    logger.info(`Product ${productId} deleted`);
  }

  async incrementViewCount(productId) {
    await Product.findByIdAndUpdate(productId, { $inc: { viewCount: 1 } });
  }

  async getProductRecommendations(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    const limit = 10;
    let recommendations = [];
    const recommendedIds = new Set();
    recommendedIds.add(product._id.toString());

    try {
      // 1. Frequently Bought Together
      const fbtOrderItems = await OrderItem.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: '$orderId' } }
      ]);
      const orderIds = fbtOrderItems.map(item => item._id);

      if (orderIds.length > 0) {
        const fbtProductsRaw = await OrderItem.aggregate([
          { $match: { orderId: { $in: orderIds }, productId: { $ne: new mongoose.Types.ObjectId(productId) } } },
          { $group: { _id: '$productId', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: limit }
        ]);

        const fbtProductIds = fbtProductsRaw.map(p => p._id);
        if (fbtProductIds.length > 0) {
          const fbtProducts = await Product.find({ _id: { $in: fbtProductIds }, isActive: true, isDeleted: false })
            .populate('brandId', 'name slug logo')
            .populate('categoryId', 'name slug image');
          
          fbtProducts.forEach(p => {
            if (!recommendedIds.has(p._id.toString())) {
              recommendations.push(p);
              recommendedIds.add(p._id.toString());
            }
          });
        }
      }

      // 2. Similar Products (Same Category)
      if (recommendations.length < limit) {
        const similarProducts = await Product.find({
          categoryId: product.categoryId,
          _id: { $nin: Array.from(recommendedIds).map(id => new mongoose.Types.ObjectId(id)) },
          isActive: true,
          isDeleted: false
        })
          .populate('brandId', 'name slug logo')
          .populate('categoryId', 'name slug image')
          .sort({ soldCount: -1, rating: -1 })
          .limit(limit - recommendations.length);

        similarProducts.forEach(p => {
          recommendations.push(p);
          recommendedIds.add(p._id.toString());
        });
      }

      // 3. Transform to standard format
      return recommendations.map(p => ({
        id: p._id,
        title: p.title,
        slug: p.slug,
        brand: p.brandId ? { name: p.brandId.name } : null,
        category: p.categoryId ? { name: p.categoryId.name } : null,
        images: p.images,
        price: p.price,
        discount: p.discount,
        discountedPrice: p.discountedPrice,
        stock: p.stock,
        rating: p.rating,
        reviewCount: p.reviewCount
      }));
    } catch (error) {
      logger.error(`Error fetching recommendations for product ${productId}: ${error.message}`);
      return []; // Return empty array on error so UI doesn't break
    }
  }
}

module.exports = new ProductService();
