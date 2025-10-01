import { randomUUID } from "node:crypto";
import pool from "../db/client";
import ClientError from "../exceptions/ClientError";
import NotfounError from "../exceptions/NotFoundError";
import InvariantError from "../exceptions/InvariantError.js";
import { PG_ERRORS } from "../utils/postgresErrorCodes.js";
import NotFoundError from "../exceptions/NotFoundError";

export default class ProductsService {
  constructor() {
    this._pool = pool;
  }

  async verifyNewProductName(name) {
    const query = {
      text: "SELECT name FROM products WHERE name = $1",
      values: [name],
    };
    const result = await this._pool.query(query);
    if (result.rows > 0) {
      throw new ClientError("product name already exist.");
    }
  }

  async addProduct({ name, count, price }) {
    try {
      await this.verifyNewProductName(name);
      const id = `product-${randomUUID()}`;
      const query = {
        text: "INSERT INTO products ($1, $2, $3, $4) RETURNING id",
        values: [id, name, count, price],
      };
      const result = await this._pool.query(query);
      return result.rows[0].id;
    } catch (error) {
      if (error.code === PG_ERRORS.UNIQUE_VIOLATION) {
        throw new InvariantError(
          "fail to add product, product name already exist"
        );
      }
      console.error("Database Error in addProduct:", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const result = await this._pool.query(
        "SELECT id, name, price, category, stock FROM products ORDER BY name ASC"
      );
      return result.rows;
    } catch (error) {
      console.error("Database Error in getProducts:", error);
      throw error;
    }
  }
  async getProductById(id) {
    try {
      const query = {
        text: "SELECT * FROM products WHERE id = $1",
        values: [id],
      };
      const result = await this._pool.query(query);
      if (result.rowCount === 0) {
        throw new NotFoundError(`Produk with id ${id} not found`);
      }
      return result.rows[0];
    } catch (error) {
      console.error(`Database Error in getProductById for id ${id}:`, error);
      throw error;
    }
  }

  // by id
  async updateProduct(id, { name, price, category, stock }) {
    try {
      const query = {
        text: "UPDATE products SET name = $1, price = $2, category = $3, stock = $4 WHERE id = $5 RETURNING id",
        values: [name, price, category, stock, id],
      };
      const result = await this._pool.query(query);
      return result.rows[0];
    } catch (error) {
      if (error.code === PG_ERRORS.UNIQUE_VIOLATION) {
        throw new InvariantError("fail to update product");
      }
      console.error(`Database Error in updateProduct for id ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const query = {
        text: "DELETE FROM products WHERE id = $1",
        values: [id],
      };
      const result = await this._pool.query(query);

      if (result.rowCount === 0) {
        throw new NotFoundError("fail to deleting product, id not found");
      }
    } catch (error) {
      console.error(`Database Error in deleteProduct for id ${id}:`, error);
      throw error;
    }
  }
}
