const Brand = require('../models/Brand.model');
const Product = require('../models/Product.model');
const logger = require('../utils/logger');

class BrandService {
  async getBrands() {
    const brands = await Brand.find({ isActive: true, isDeleted: false }).sort({ name: 1 });

    return brands.map(brand => ({
      id: brand._id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      logo: brand.logo,
      website: brand.website,
      isActive: brand.isActive
    }));
  }

  async createBrand(brandData) {
    const { name, description, logo, website } = brandData;

    // Check if brand with same name exists
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      const error = new Error('Brand with this name already exists');
      error.statusCode = 409;
      error.code = 'BRAND_EXISTS';
      throw error;
    }

    // Generate slug
    const slugify = require('slugify');
    const slug = slugify(name, { lower: true });

    const brand = await Brand.create({
      name,
      slug,
      description,
      logo,
      website
    });

    logger.info(`Brand ${brand._id} created`);

    return {
      id: brand._id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      logo: brand.logo,
      website: brand.website,
      isActive: brand.isActive
    };
  }

  async updateBrand(brandId, updateData) {
    const brand = await Brand.findById(brandId);

    if (!brand) {
      const error = new Error('Brand not found');
      error.statusCode = 404;
      error.code = 'BRAND_NOT_FOUND';
      throw error;
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      brand[key] = updateData[key];
    });

    // Regenerate slug if name changed
    if (updateData.name && updateData.name !== brand.name) {
      const slugify = require('slugify');
      brand.slug = slugify(updateData.name, { lower: true });
    }

    await brand.save();

    logger.info(`Brand ${brandId} updated`);

    return {
      id: brand._id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description
    };
  }

  async deleteBrand(brandId) {
    const brand = await Brand.findById(brandId);

    if (!brand) {
      const error = new Error('Brand not found');
      error.statusCode = 404;
      error.code = 'BRAND_NOT_FOUND';
      throw error;
    }

    // Check if brand has products
    const productCount = await Product.countDocuments({ brandId, isDeleted: false });
    if (productCount > 0) {
      const error = new Error('Cannot delete brand with associated products');
      error.statusCode = 400;
      error.code = 'HAS_PRODUCTS';
      throw error;
    }

    brand.isDeleted = true;
    await brand.save();

    logger.info(`Brand ${brandId} deleted`);
  }
}

module.exports = new BrandService();
