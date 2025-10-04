import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import pool from "../db/client.js";
import ClientError from "../exceptions/ClientError.js";
import NotFoundError from "../exceptions/NotFoundError.js";

export default class UsersService {
  constructor(idGenerator = randomUUID) {
    this._pool = pool;
    this._idGenerator = idGenerator;
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

  async addUser({ username, email, password, role = "CASHIER" }, requestingUserRole) {
    if (role === 'ADMIN' && requestingUserRole !== 'SUPER_ADMIN') {
      throw new InvariantError("only the super admin can create a admin account");
    }
    if (role === 'SUPER_ADMIN') {
      throw new InvariantError("cannot craete a super admin account from API");
    }

    try {
      await this.verifyNewUsername(username);
      const id = `user-${this._idGenerator()}`;
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = {
        text: 'INSERT INTO users(id, username, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [id, username, email, hashedPassword, role],
      };

      const result = await this._pool.query(query);
      if (!result.rows[0]?.id) {
        throw new Error("failed to register");
      }
      return result.rows[0].id;
    } catch (error) {
      if (error instanceof ClientError) {
        throw error;
      }
      if (error.code === PG_ERRORS.UNIQUE_VIOLATION) {
        throw new InvariantError("sign up failed: email already used.");
      }
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const query = {
        text: 'SELECT id, username, email, role FROM users WHERE id = $1',
        values: [id],
      };
      const result = await this._pool.query(query);
      if (result.rowCount === 0) {
        throw new NotFoundError('user cannot found');
      }
      return result.rows[0];
    } catch (error) {
      console.error(`Database Error in getUserById for id ${id}:`, error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const query = {
        text: 'SELECT id, username, email, password, role FROM users WHERE email = $1',
        values: [email],
      };
      const result = await this._pool.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Database Error in getUserByEmail for email ${email}:`, error);
      throw error;
    }
  }
  // dev func
  // for admin role
  async getAllUsers({ limit, offset }) {
    const totalResult = await this._pool.query(
      "SELECT COUNT(*) AS total FROM users"
    );
    const totalData = parseInt(totalResult.rows[0].total, 10);

    const dataResult = await this._pool.query({
      text: "SELECT id, username, email, role FROM users ORDER BY username ASC LIMIT $1 OFFSET $2",
      values: [limit, offset],
    });

    return {
      users: dataResult.rows,
      totalData,
    };
  }
}
