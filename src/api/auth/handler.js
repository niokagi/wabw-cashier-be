import Boom from "@hapi/boom";
import AuthService from "../../services/AuthService.js";
import UsersService from "../../services/UsersService.js";
import AuthenticationError from "../../exceptions/AuthenticationError.js";
import ClientError from "../../exceptions/ClientError.js";

class AuthHandler {
  constructor() {
    this._usersService = new UsersService();
    // dependency injection [!]
    this._authService = new AuthService(this._usersService);
    this.signInHandler = this.signInHandler.bind(this);
    this.signUpHandler = this.signUpHandler.bind(this);
  }

  async signInHandler(request, h) {
    try {
      const { email, password } = request.payload;
      const result = await this._authService.signIn(email, password);

      return h
        .response({
          // user: {
          //   id: result.user.id,
          //   username: result.user.username,
          //   email: result.user.email,
          //   role: result.user.role,
          // },
          token: result.token,
          status: "success",
          message: "Sign in successful",
        })
        .code(200);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return Boom.unauthorized(error.message);
      }
      console.error("SignIn Handler Error:", error);
      return Boom.internal("An internal server error occurred");
    }
  }

  async signUpHandler(request, h) {
    try {
      const { username, email, password } = request.payload;
      const userId = await this._authService.signUp({
        username,
        email,
        password,
      });
      return h
        .response({
          status: "success",
          message: "User registered successfully",
          data: { userId },
        })
        .code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return Boom.badRequest(error.message);
      }
      console.error("SignUp Handler Error:", error);
      return Boom.internal("An internal server error occurred");
    }
  }
}

export default AuthHandler;
