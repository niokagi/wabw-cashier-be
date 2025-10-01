import OrdersHandler from "./handler";

export const ordersPlugin = {
  name: "api-orders",
  version: "1.0.0",
  register: async (server) => {
    // to be
    const ordersHandler = new OrdersHandler();
    // const ordersRoute = *new class order routes
  },
};
