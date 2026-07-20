const brandService = require('../services/brand.service');

const getBrands = async (req, res) => {
  try {
    const brands = await brandService.getBrands();
    res.status(200).json({
      success: true,
      message: 'Brands retrieved successfully',
      data: brands
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve brands',
      error: {
        code: error.code || 'GET_BRANDS_ERROR'
      }
    });
  }
};

const createBrand = async (req, res) => {
  try {
    const brand = await brandService.createBrand(req.body);
    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create brand',
      error: {
        code: error.code || 'CREATE_BRAND_ERROR'
      }
    });
  }
};

const updateBrand = async (req, res) => {
  try {
    const brand = await brandService.updateBrand(req.params.brandId, req.body);
    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data: brand
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update brand',
      error: {
        code: error.code || 'UPDATE_BRAND_ERROR'
      }
    });
  }
};

const deleteBrand = async (req, res) => {
  try {
    await brandService.deleteBrand(req.params.brandId);
    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete brand',
      error: {
        code: error.code || 'DELETE_BRAND_ERROR'
      }
    });
  }
};

module.exports = {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
};
