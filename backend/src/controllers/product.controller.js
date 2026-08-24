const productService = require('../services/product.service');
const { parse } = require('csv-parse/sync');
const Product = require('../models/Product.model');
const Category = require('../models/Category.model');

const getProducts = async (req, res) => {
  try {
    const result = await productService.getProducts(req.query);
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: result.products,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve products',
      error: {
        code: error.code || 'GET_PRODUCTS_ERROR'
      }
    });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    
    // Increment view count
    await productService.incrementViewCount(product.id);
    
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve product',
      error: {
        code: error.code || 'GET_PRODUCT_ERROR'
      }
    });
  }
};

const getProductRecommendations = async (req, res) => {
  try {
    const recommendations = await productService.getProductRecommendations(req.params.productId);
    res.status(200).json({
      success: true,
      message: 'Product recommendations retrieved successfully',
      data: recommendations
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve recommendations',
      error: {
        code: error.code || 'GET_RECOMMENDATIONS_ERROR'
      }
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body, req.user);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create product',
      error: {
        code: error.code || 'CREATE_PRODUCT_ERROR'
      }
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.productId, req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update product',
      error: {
        code: error.code || 'UPDATE_PRODUCT_ERROR'
      }
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.productId, req.user);
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete product',
      error: {
        code: error.code || 'DELETE_PRODUCT_ERROR'
      }
    });
  }
};

const importProductsCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    const categories = await Category.find();

    const productsToInsert = [];
    for (const record of records) {
      let categoryId = null;
      if (record.category) {
        const cat = categories.find(c => c.name.toLowerCase() === record.category.toLowerCase().trim());
        if (cat) categoryId = cat._id;
      }

      if (!categoryId && categories.length > 0) {
        categoryId = categories[0]._id;
      }

      productsToInsert.push({
        title: record.title,
        description: record.description || record.title,
        price: parseFloat(record.price) || 0,
        stockQuantity: parseInt(record.stock) || 0,
        category: categoryId,
        vendor: req.user.id,
        status: 'published'
      });
    }

    const inserted = await Product.insertMany(productsToInsert);

    res.status(200).json({
      success: true,
      message: `${inserted.length} products imported successfully`,
      data: inserted
    });
  } catch (error) {
    console.error('IMPORT PRODUCTS CSV ERROR:', error);
    res.status(500).json({ success: false, message: 'Failed to import products from CSV' });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getProductRecommendations,
  createProduct,
  updateProduct,
  deleteProduct,
  importProductsCsv
};
