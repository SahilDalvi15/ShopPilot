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
    .valid('cod', 'razorpay')
    .required()
    .messages({
      'any.only': 'Payment method must be either cod or razorpay',
      'any.required': 'Payment method is required',
    }),
  paymentDetails: Joi.object()
    .when('paymentMethod', {
      is: 'razorpay',
      then: Joi.object({
        razorpayOrderId: Joi.string().required().messages({
          'any.required': 'Razorpay order ID is required',
        }),
        razorpayPaymentId: Joi.string().required().messages({
          'any.required': 'Razorpay payment ID is required',
        }),
        razorpaySignature: Joi.string().required().messages({
          'any.required': 'Razorpay signature is required',
        }),
      }),
      otherwise: Joi.optional(),
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
