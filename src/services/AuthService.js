import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthenticationError from "../exceptions/AuthenticationError.js";

const AUTH_ERROR_MESSAGE = "incorrect credentials given";

export default class AuthService {
  constructor(usersService) {
    this._usersService = usersService;
  }

  async signIn(email, password) {
    try {
      const user = await this._usersService.getUserByEmail(email);
      if (!user) {
        throw new AuthenticationError(AUTH_ERROR_MESSAGE);
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw new AuthenticationError(AUTH_ERROR_MESSAGE);
      }
      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      return {
        token: token,
        // user: {
        //   id: user.id,
        //   username: user.username,
        //   email: user.email,
        //   role: user.role,
        // },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signUp({ username, email, password }) {
    try {
      const userId = await this._usersService.addUser({
        username,
        email,
        password,
      });
      return userId;
    } catch (error) {
      console.error(`error: ${error}`);
      throw error;
    }
  }
}
