const logger = require('./logger');

// In-memory cache as fallback
const memoryCache = new Map();

const connectRedis = async () => {
  logger.info('Using in-memory cache instead of Redis');
  return true;
};

const getRedisClient = () => {
  return null; // Not needed for in-memory mock
};

// Cache helpers
const setCache = async (key, value, expiry = 3600) => {
  try {
    memoryCache.set(key, {
      value,
      expiry: Date.now() + expiry * 1000
    });
    return true;
  } catch (error) {
    logger.error('Error setting cache:', error);
    return false;
  }
};

const getCache = async (key) => {
  try {
    const item = memoryCache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      memoryCache.delete(key);
      return null;
    }
    return item.value;
  } catch (error) {
    logger.error('Error getting cache:', error);
    return null;
  }
};

const deleteCache = async (key) => {
  try {
    memoryCache.delete(key);
    return true;
  } catch (error) {
    logger.error('Error deleting cache:', error);
    return false;
  }
};

const deletePattern = async (pattern) => {
  try {
    // Simple mock for deletePattern: clear everything
    memoryCache.clear();
    return true;
  } catch (error) {
    logger.error('Error deleting pattern:', error);
    return false;
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  setCache,
  getCache,
  deleteCache,
  deletePattern
};
