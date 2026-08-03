const Joi = require('joi');

const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required().messages({
          'any.required': 'Product ID is required',
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          'number.min': 'Quantity must be at least 1',
          'any.required': 'Quantity is required',
        }),
        price: Joi.number().positive().required().messages({
          'number.positive': 'Price must be positive',
          'any.required': 'Price is required',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one item is required',
      'any.required': 'Items are required',
    }),
  shippingAddress: Joi.string().required().messages({
    'any.required': 'Shipping address is required',
  }),
  paymentMethod: Joi.string()
    .valid('cod')
    .required()
    .messages({
      'any.only': 'Payment method must be COD',
      'any.required': 'Payment method is required',
    }),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, processing, shipped, delivered, cancelled',
      'any.required': 'Status is required',
    }),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};
