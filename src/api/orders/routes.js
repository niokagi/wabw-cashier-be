import Joi from 'joi';
import { OrderPayloadSchema } from './validator.js';

export const createOrdersRoutes = (handler) => [
  {
    method: 'POST',
    path: '/orders',
    handler: handler.postOrderHandler,
    options: {
      auth: 'jwt_strategy',
      validate: { payload: OrderPayloadSchema },
      description: 'Create a new order',
      tags: ['api', 'orders'],
    },
  },
  {
    method: 'GET',
    path: '/orders',
    handler: handler.getOrdersHandler,
    options: {
      auth: 'jwt_strategy',
      description: 'Get all orders (for reports)',
      tags: ['api', 'orders'],
    },
  },
  {
    method: 'GET',
    path: '/orders/{id}',
    handler: handler.getOrderByIdHandler,
    options: {
      auth: 'jwt_strategy',
      validate: { params: Joi.object({ id: Joi.number().integer().required() }) },
      description: 'Get an order by its ID',
      tags: ['api', 'orders'],
    },
  },
];
