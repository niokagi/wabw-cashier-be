import Lab from "@hapi/lab";
import { expect } from "@hapi/code";
import Sinon from "sinon";
import jwt from "jsonwebtoken";
import { init } from "../../src/server.js";
import ProductsService from "../../src/services/ProductsService.js";
import NotFoundError from "../../src/exceptions/NotFoundError.js";

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;

describe("Products API", () => {
  let server;
  let sandbox;
  let fakeAuthToken;

  beforeEach(async () => {
    sandbox = Sinon.createSandbox();
    const payload = {
      sub: "user-123",
      email: "test@user.com",
      role: "CASHIER",
    };
    fakeAuthToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    server = await init();
  });

  afterEach(async () => {
    sandbox.restore();
    await server.stop();
  });

  describe("GET /products", () => {
    it("should respond with 200 and a list of products", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Nasi Goreng",
          price: "25000.00",
          category: "FOOD",
          stock: 50,
        },
        {
          id: 2,
          name: "Es Teh Manis",
          price: "5000.00",
          category: "BEVERAGE",
          stock: 100,
        },
      ];
      sandbox
        .stub(ProductsService.prototype, "getProducts")
        .resolves(mockProducts);

      const res = await server.inject({
        method: "GET",
        url: "/products",
        headers: {
          Authorization: `Bearer ${fakeAuthToken}`,
        },
      });
      const responsePayload = JSON.parse(res.payload);

      expect(res.statusCode).to.equal(200);
      expect(responsePayload.status).to.equal("success");
      expect(responsePayload.data.products).to.equal(mockProducts);
    });
  });
});
