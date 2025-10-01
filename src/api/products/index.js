import ProductsHandler from "./handler.js";
import { createProductsRoutes } from "./routes.js";

export const productsPlugin = {
  name: "api-products",
  version: "1.0.0",
  register: async (server) => {
    const productsHandler = new ProductsHandler();
    const productsRoutes = createProductsRoutes(productsHandler);
    server.route(productsRoutes);
  },
};
