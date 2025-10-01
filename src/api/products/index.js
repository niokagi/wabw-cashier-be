import ProductsService from "../../services/ProductsService.js";
import ProductsHandler from "./handler.js";
import { productsRoutes } from "./routes.js";

export const productsPlugin = {
  name: "api-products",
  version: "1.0.0",
  register: async (server) => {
    const productsService = new ProductsService();
    const productsHandler = new ProductsHandler(productsService);
    server.route(productsRoutes(productsHandler));
  },
};
