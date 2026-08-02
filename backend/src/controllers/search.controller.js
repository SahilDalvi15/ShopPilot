const elasticsearch = require('../config/elasticsearch');
const logger = require('../utils/logger');

const searchProducts = async (req, res) => {
  try {
    const { q, category, brand, minPrice, maxPrice, inStock, sortBy, page, limit } = req.query;
    
    const filters = {
      category,
      brand,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStock: inStock === 'true' ? true : undefined,
      sortBy,
      offset: page ? (parseInt(page) - 1) * (limit || 20) : 0,
      limit: limit ? parseInt(limit) : 20,
    };

    const results = await elasticsearch.searchProducts(q, filters);

    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: {
        products: results.products,
        total: results.total,
        took: results.took,
        pagination: {
          page: page ? parseInt(page) : 1,
          limit: filters.limit,
          total: results.total,
          totalPages: Math.ceil(results.total / filters.limit),
        },
      },
    });
  } catch (error) {
    logger.error(`Search error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: {
        code: 'SEARCH_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(200).json({
        success: true,
        data: {
          suggestions: [],
        },
      });
    }

    const suggestions = await elasticsearch.getSearchSuggestions(q);

    res.status(200).json({
      success: true,
      data: {
        suggestions,
      },
    });
  } catch (error) {
    logger.error(`Search suggestions error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions',
      error: {
        code: 'SUGGESTIONS_ERROR',
      },
    });
  }
};

module.exports = {
  searchProducts,
  getSearchSuggestions,
};
