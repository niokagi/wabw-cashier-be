import Boom from "@hapi/boom";
import ProductsService from "../../services/ProductsService.js";
import ClientError from "../../exceptions/ClientError.js";

export default class ProductsHandler {
  constructor() {
    this._service = new ProductsService();

    this.postProductHandler = this.postProductHandler.bind(this);
    this.getProductsHandler = this.getProductsHandler.bind(this);
    this.getProductByIdHandler = this.getProductByIdHandler.bind(this);
    this.putProductByIdHandler = this.putProductByIdHandler.bind(this);
    this.deleteProductByIdHandler = this.deleteProductByIdHandler.bind(this);
  }

  async postProductHandler(request, h) {
    try {
      const productId = await this._service.addProduct(request.payload);
      return h
        .response({
          status: "success",
          message: "product added!",
          data: { productId },
        })
        .code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return Boom.badRequest(error.message);
      }
      console.error(error);
      return Boom.internal();
    }
  }

  async getProductsHandler(request, h) {
    try {
      const products = await this._service.getProducts();
      return {
        status: "success",
        data: { products },
      };
    } catch (error) {
      console.error(error);
      return Boom.internal();
    }
  }

  async getProductByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const product = await this._service.getProductById(id);
      return {
        status: "success",
        data: { product },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return Boom.notFound(error.message);
      }
      console.error(error);
      return Boom.internal();
    }
  }

  async putProductByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.updateProduct(id, request.payload);
      return {
        status: "success",
        message: "product updated!",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return Boom.isBoom(error) ? error : Boom.badRequest(error.message);
      }
      console.error(error);
      return Boom.internal();
    }
  }

  async deleteProductByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteProduct(id);
      return {
        status: "success",
        message: "product deleted!",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return Boom.notFound(error.message);
      }
      console.error(error);
      return Boom.internal();
    }
  }
}
