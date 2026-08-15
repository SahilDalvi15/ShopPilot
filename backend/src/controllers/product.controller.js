const productService = require('../services/product.service');

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
    const product = await productService.createProduct(req.body, req.user.id);
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
    const product = await productService.updateProduct(req.params.productId, req.body, req.user.id);
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
    await productService.deleteProduct(req.params.productId);
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

module.exports = {
  getProducts,
  getProductBySlug,
  getProductRecommendations,
  createProduct,
  updateProduct,
  deleteProduct
};
