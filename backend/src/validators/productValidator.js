const Joi = require('joi');

const createProductSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title must not exceed 200 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().min(10).max(2000).required().messages({
    'string.min': 'Description must be at least 10 characters',
    'string.max': 'Description must not exceed 2000 characters',
    'any.required': 'Description is required',
  }),
  price: Joi.number().positive().required().messages({
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is required',
  }),
  discount: Joi.number().min(0).max(100).default(0).messages({
    'number.min': 'Discount cannot be negative',
    'number.max': 'Discount cannot exceed 100%',
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.min': 'Stock cannot be negative',
    'any.required': 'Stock is required',
  }),
  category: Joi.string().required().messages({
    'any.required': 'Category is required',
  }),
  brand: Joi.string().required().messages({
    'any.required': 'Brand is required',
  }),
  images: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .max(5)
    .required()
    .messages({
      'array.min': 'At least one image is required',
      'array.max': 'Maximum 5 images allowed',
      'string.uri': 'Each image must be a valid URL',
      'any.required': 'Images are required',
    }),
  specifications: Joi.object().pattern(
    Joi.string(),
    Joi.string()
  ).optional(),
  features: Joi.array().items(Joi.string()).optional(),
});

const updateProductSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional().messages({
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title must not exceed 200 characters',
  }),
  description: Joi.string().min(10).max(2000).optional().messages({
    'string.min': 'Description must be at least 10 characters',
    'string.max': 'Description must not exceed 2000 characters',
  }),
  price: Joi.number().positive().optional().messages({
    'number.positive': 'Price must be a positive number',
  }),
  discount: Joi.number().min(0).max(100).optional().messages({
    'number.min': 'Discount cannot be negative',
    'number.max': 'Discount cannot exceed 100%',
  }),
  stock: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Stock cannot be negative',
  }),
  category: Joi.string().optional(),
  brand: Joi.string().optional(),
  images: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .max(5)
    .optional()
    .messages({
      'array.min': 'At least one image is required',
      'array.max': 'Maximum 5 images allowed',
      'string.uri': 'Each image must be a valid URL',
    }),
  specifications: Joi.object().pattern(
    Joi.string(),
    Joi.string()
  ).optional(),
  features: Joi.array().items(Joi.string()).optional(),
}).min(1);

module.exports = {
  createProductSchema,
  updateProductSchema,
};
