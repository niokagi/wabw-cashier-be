import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import pool from "../db/client.js";
import ClientError from "../exceptions/ClientError.js";
import NotFoundError from "../exceptions/NotFoundError.js";

export default class UsersService {
  constructor() {
    this._pool = pool;
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new ClientError("username already taken.", 400);
    }
  }

  async addUser({ username, email, password }) {
    await this.verifyNewUsername(username);

    const id = `user-${randomUUID()}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, email, hashedPassword],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new Error("failed to register");
    }

    return result.rows[0].id;
  }

  async getUserById(id) {
    const query = {
      text: "SELECT id, username, email, role FROM users WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("user not found");
    }
    return result.rows[0];
  }

  async getUserByEmail(email) {
    const query = {
      text: "SELECT id, username, email, password, role FROM users WHERE email = $1",
      values: [email],
    };
    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  // dev func
  // async getAllUsers({ limit, offset }) {
  //   const totalResult = await this._pool.query(
  //     "SELECT COUNT(*) AS total FROM users"
  //   );
  //   const totalData = parseInt(totalResult.rows[0].total, 10);

  //   const dataResult = await this._pool.query({
  //     text: "SELECT id, username, email FROM users ORDER BY username ASC LIMIT $1 OFFSET $2",
  //     values: [limit, offset],
  //   });

  //   return {
  //     users: dataResult.rows,
  //     totalData,
  //   };
  // }
}
