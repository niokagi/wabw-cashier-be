import Joi from 'joi';

const OrderItemSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const OrderPayloadSchema = Joi.object({
  items: Joi.array().items(OrderItemSchema).min(1).required(),
  customerName: Joi.string().allow('').optional(),
  paymentMethod: Joi.string().valid('CASH', 'QRIS').required(),
});