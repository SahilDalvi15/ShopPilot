const { Client } = require('@elastic/elasticsearch');
const logger = require('../utils/logger');

// Create Elasticsearch client
const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
    ? {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      }
    : undefined,
});

// Index name for products
const PRODUCTS_INDEX = 'shoppilot-products';

// Initialize index with mapping
const initializeIndex = async () => {
  try {
    const indexExists = await client.indices.exists({ index: PRODUCTS_INDEX });
    
    if (!indexExists) {
      await client.indices.create({
        index: PRODUCTS_INDEX,
        body: {
          mappings: {
            properties: {
              title: { type: 'text', analyzer: 'standard' },
              description: { type: 'text', analyzer: 'standard' },
              brand: { type: 'keyword' },
              category: { type: 'keyword' },
              price: { type: 'double' },
              discount: { type: 'double' },
              stock: { type: 'integer' },
              rating: { type: 'float' },
              specifications: { type: 'object', enabled: false },
              images: { type: 'keyword' },
              slug: { type: 'keyword' },
              isActive: { type: 'boolean' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
          settings: {
            analysis: {
              analyzer: {
                standard: {
                  type: 'standard',
                  stopwords: '_english_',
                },
              },
            },
          },
        },
      });
      logger.info(`Elasticsearch index '${PRODUCTS_INDEX}' created`);
    } else {
      logger.info(`Elasticsearch index '${PRODUCTS_INDEX}' already exists`);
    }
  } catch (error) {
    logger.error(`Failed to initialize Elasticsearch index: ${error.message}`);
    throw error;
  }
};

// Index a single product
const indexProduct = async (product) => {
  try {
    await client.index({
      index: PRODUCTS_INDEX,
      id: product._id.toString(),
      body: {
        title: product.title,
        description: product.description,
        brand: product.brand,
        category: product.category,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        rating: product.rating || 0,
        specifications: product.specifications,
        images: product.images,
        slug: product.slug,
        isActive: product.isActive !== false,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
    logger.info(`Product ${product._id} indexed in Elasticsearch`);
  } catch (error) {
    logger.error(`Failed to index product ${product._id}: ${error.message}`);
  }
};

// Bulk index products
const bulkIndexProducts = async (products) => {
  try {
    const body = products.flatMap((product) => [
      { index: { _index: PRODUCTS_INDEX, _id: product._id.toString() } },
      {
        title: product.title,
        description: product.description,
        brand: product.brand,
        category: product.category,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        rating: product.rating || 0,
        specifications: product.specifications,
        images: product.images,
        slug: product.slug,
        isActive: product.isActive !== false,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    ]);

    const response = await client.bulk({ refresh: true, body });
    
    if (response.errors) {
      const erroredDocuments = [];
      response.items.forEach((item, i) => {
        if (item.index && item.index.error) {
          erroredDocuments.push({
            status: item.index.status,
            error: item.index.error,
            operation: item.index.op,
            id: item.index._id,
          });
        }
      });
      logger.error(`Bulk indexing errors: ${JSON.stringify(erroredDocuments)}`);
    } else {
      logger.info(`Successfully indexed ${products.length} products`);
    }
  } catch (error) {
    logger.error(`Failed to bulk index products: ${error.message}`);
    throw error;
  }
};

// Delete product from index
const deleteProduct = async (productId) => {
  try {
    await client.delete({
      index: PRODUCTS_INDEX,
      id: productId.toString(),
    });
    logger.info(`Product ${productId} deleted from Elasticsearch`);
  } catch (error) {
    if (error.meta?.statusCode === 404) {
      logger.warn(`Product ${productId} not found in Elasticsearch`);
    } else {
      logger.error(`Failed to delete product ${productId}: ${error.message}`);
    }
  }
};

// Search products
const searchProducts = async (query, filters = {}) => {
  try {
    const must = [];
    const filter = [];

    // Text search
    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['title^3', 'description^2', 'brand'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      });
    }

    // Category filter
    if (filters.category) {
      filter.push({
        term: { category: filters.category },
      });
    }

    // Brand filter
    if (filters.brand) {
      filter.push({
        term: { brand: filters.brand },
      });
    }

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      const rangeQuery = {};
      if (filters.minPrice) rangeQuery.gte = filters.minPrice;
      if (filters.maxPrice) rangeQuery.lte = filters.maxPrice;
      filter.push({
        range: { price: rangeQuery },
      });
    }

    // In stock filter
    if (filters.inStock === true) {
      filter.push({
        range: { stock: { gt: 0 } },
      });
    }

    // Build search query
    const searchBody = {
      query: {
        bool: {
          must,
          filter,
          must_not: [
            { term: { isActive: false } },
          ],
        },
      },
      sort: [],
      from: filters.offset || 0,
      size: filters.limit || 20,
    };

    // Sorting
    if (filters.sortBy) {
      const sortField = filters.sortBy === 'price_asc' ? 'price' : 
                        filters.sortBy === 'price_desc' ? 'price' :
                        filters.sortBy === 'rating' ? 'rating' :
                        filters.sortBy === 'newest' ? 'createdAt' : 'createdAt';
      
      const sortOrder = filters.sortBy === 'price_asc' ? 'asc' : 
                        filters.sortBy === 'price_desc' ? 'desc' : 'desc';
      
      searchBody.sort.push({ [sortField]: { order: sortOrder } });
    } else {
      searchBody.sort.push({ createdAt: { order: 'desc' } });
    }

    const response = await client.search({
      index: PRODUCTS_INDEX,
      body: searchBody,
    });

    const hits = response.hits.hits.map((hit) => ({
      _id: hit._id,
      ...hit._source,
      _score: hit._score,
    }));

    return {
      products: hits,
      total: response.hits.total.value,
      took: response.took,
    };
  } catch (error) {
    logger.error(`Search failed: ${error.message}`);
    throw error;
  }
};

// Get search suggestions
const getSearchSuggestions = async (query) => {
  try {
    const response = await client.search({
      index: PRODUCTS_INDEX,
      body: {
        query: {
          multi_match: {
            query,
            fields: ['title^5', 'brand^3'],
            type: 'phrase_prefix',
            fuzziness: 'AUTO',
          },
        },
        size: 5,
        _source: ['title', 'brand', 'slug', 'images'],
      },
    });

    return response.hits.hits.map((hit) => ({
      title: hit._source.title,
      brand: hit._source.brand,
      slug: hit._source.slug,
      image: hit._source.images?.[0],
    }));
  } catch (error) {
    logger.error(`Failed to get search suggestions: ${error.message}`);
    return [];
  }
};

module.exports = {
  client,
  initializeIndex,
  indexProduct,
  bulkIndexProducts,
  deleteProduct,
  searchProducts,
  getSearchSuggestions,
  PRODUCTS_INDEX,
};
