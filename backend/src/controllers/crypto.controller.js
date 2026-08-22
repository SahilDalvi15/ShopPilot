const axios = require('axios');
const logger = require('../utils/logger');

// Cache to store the rates for a short time to avoid hitting rate limits
let ratesCache = {
  data: null,
  timestamp: 0
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCryptoRates = async (req, res) => {
  try {
    const now = Date.now();
    
    // Check if we have valid cached data
    if (ratesCache.data && (now - ratesCache.timestamp < CACHE_TTL)) {
      return res.status(200).json({
        success: true,
        data: ratesCache.data
      });
    }

    // Fetch from CoinGecko
    // We fetch Bitcoin and Ethereum prices in INR and USD
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum',
        vs_currencies: 'inr,usd'
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    // Update cache
    ratesCache = {
      data: response.data,
      timestamp: now
    };

    res.status(200).json({
      success: true,
      data: response.data
    });

  } catch (error) {
    logger.error(`Error fetching crypto rates: ${error.message}`);
    
    // If the API fails but we have stale cache, return it rather than breaking the checkout
    if (ratesCache.data) {
      return res.status(200).json({
        success: true,
        data: ratesCache.data,
        cached: true
      });
    }

    // Fallback static rates if everything fails (approximate as of 2024)
    const fallbackRates = {
      bitcoin: { inr: 5000000, usd: 60000 },
      ethereum: { inr: 250000, usd: 3000 }
    };

    res.status(200).json({
      success: true,
      data: fallbackRates,
      fallback: true
    });
  }
};

module.exports = {
  getCryptoRates
};
