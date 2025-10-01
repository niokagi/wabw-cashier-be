export default class ProductsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async showProductByIdHandler(request, h) {
    try {
      const { id } = request.payload;
      const result = await this._service.getProductById(id);

      return h.response({
        status: "success",
        data: {
          result,
        },
      });
    } catch (error) {}
  }
}
