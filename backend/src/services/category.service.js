const Category = require('../models/Category.model');
const logger = require('../utils/logger');

class CategoryService {
  async getCategories(query) {
    const { parentId, level } = query;

    const queryObj = {
      isActive: true,
      isDeleted: false
    };

    if (parentId) {
      queryObj.parentId = parentId;
    }

    if (level !== undefined) {
      queryObj.level = parseInt(level);
    }

    const categories = await Category.find(queryObj).sort({ name: 1 });

    return categories.map(cat => ({
      id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      parentId: cat.parentId,
      level: cat.level,
      image: cat.image,
      icon: cat.icon,
      isActive: cat.isActive
    }));
  }

  async createCategory(categoryData) {
    const { name, description, parentId, image, icon } = categoryData;

    // Check if category with same name exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      const error = new Error('Category with this name already exists');
      error.statusCode = 409;
      error.code = 'CATEGORY_EXISTS';
      throw error;
    }

    // Determine level based on parent
    let level = 0;
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) {
        const error = new Error('Parent category not found');
        error.statusCode = 404;
        error.code = 'PARENT_NOT_FOUND';
        throw error;
      }
      level = parent.level + 1;
    }

    // Generate slug
    const slugify = require('slugify');
    const slug = slugify(name, { lower: true });

    const category = await Category.create({
      name,
      slug,
      description,
      parentId,
      level,
      image,
      icon
    });

    logger.info(`Category ${category._id} created`);

    return {
      id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      level: category.level,
      image: category.image,
      icon: category.icon,
      isActive: category.isActive
    };
  }

  async updateCategory(categoryId, updateData) {
    const category = await Category.findById(categoryId);

    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      error.code = 'CATEGORY_NOT_FOUND';
      throw error;
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'parentId') {
        category[key] = updateData[key];
      }
    });

    // Handle parent change
    if (updateData.parentId !== undefined) {
      if (updateData.parentId) {
        const parent = await Category.findById(updateData.parentId);
        if (!parent) {
          const error = new Error('Parent category not found');
          error.statusCode = 404;
          error.code = 'PARENT_NOT_FOUND';
          throw error;
        }
        category.parentId = updateData.parentId;
        category.level = parent.level + 1;
      } else {
        category.parentId = null;
        category.level = 0;
      }
    }

    // Regenerate slug if name changed
    if (updateData.name && updateData.name !== category.name) {
      const slugify = require('slugify');
      category.slug = slugify(updateData.name, { lower: true });
    }

    await category.save();

    logger.info(`Category ${categoryId} updated`);

    return {
      id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description
    };
  }

  async deleteCategory(categoryId) {
    const category = await Category.findById(categoryId);

    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      error.code = 'CATEGORY_NOT_FOUND';
      throw error;
    }

    // Check if category has children
    const childCount = await Category.countDocuments({ parentId: categoryId, isDeleted: false });
    if (childCount > 0) {
      const error = new Error('Cannot delete category with child categories');
      error.statusCode = 400;
      error.code = 'HAS_CHILDREN';
      throw error;
    }

    category.isDeleted = true;
    await category.save();

    logger.info(`Category ${categoryId} deleted`);
  }
}

module.exports = new CategoryService();
