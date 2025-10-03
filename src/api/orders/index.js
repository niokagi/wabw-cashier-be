import OrdersHandler from './handler.js';
import { createOrdersRoutes } from './routes.js';

export const ordersPlugin = {
  name: 'api-orders',
  version: '1.0.0',
  register: async (server) => {
    const ordersHandler = new OrdersHandler();
    const ordersRoutes = createOrdersRoutes(ordersHandler);
    server.route(ordersRoutes);
  },
};