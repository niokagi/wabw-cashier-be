import ProductsHandler from "./handler";
import productsRoute from "./routes";

export const productPlugin = {
  name: "products",
  version: "1.00",
  register: async (server) => {
    const productsHandler = new ProductsHandler();
    // const productsService = new ProductsService();
  },
};
