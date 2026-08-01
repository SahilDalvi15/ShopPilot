const Joi = require('joi');

const createReviewSchema = Joi.object({
  product: Joi.string().required().messages({
    'any.required': 'Product ID is required',
  }),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must not exceed 5',
      'any.required': 'Rating is required',
    }),
  title: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Review title must be at least 3 characters',
    'string.max': 'Review title must not exceed 100 characters',
    'any.required': 'Review title is required',
  }),
  comment: Joi.string().min(20).max(500).required().messages({
    'string.min': 'Review comment must be at least 20 characters',
    'string.max': 'Review comment must not exceed 500 characters',
    'any.required': 'Review comment is required',
  }),
  images: Joi.array()
    .items(Joi.string().uri())
    .max(3)
    .optional()
    .messages({
      'array.max': 'Maximum 3 images allowed',
      'string.uri': 'Each image must be a valid URL',
    }),
});

const updateReviewSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .optional()
    .messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must not exceed 5',
    }),
  title: Joi.string().min(3).max(100).optional().messages({
    'string.min': 'Review title must be at least 3 characters',
    'string.max': 'Review title must not exceed 100 characters',
  }),
  comment: Joi.string().min(20).max(500).optional().messages({
    'string.min': 'Review comment must be at least 20 characters',
    'string.max': 'Review comment must not exceed 500 characters',
  }),
  images: Joi.array()
    .items(Joi.string().uri())
    .max(3)
    .optional()
    .messages({
      'array.max': 'Maximum 3 images allowed',
      'string.uri': 'Each image must be a valid URL',
    }),
}).min(1);

module.exports = {
  createReviewSchema,
  updateReviewSchema,
};
