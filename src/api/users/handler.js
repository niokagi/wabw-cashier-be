import Boom from '@hapi/boom';
import ClientError from "../../exceptions/ClientError.js";
import { UserPayloadSchema } from "./validator.js";

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
  }

  // add/create user/admin
  async postUserHandler(request, h) {
    try {
      const { role: requestingUserRole } = request.auth.credentials.user;
      const userId = await this._service.addUser(request.payload, requestingUserRole);
      return h.response({
        status: 'success',
        message: 'sign up success',
        data: { userId },
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return Boom.boomify(error);
      }

      console.error('postUserHandler Error:', error);
      return Boom.internal('Maaf, terjadi kegagalan pada server kami.');
    }
  }

  // dev
  // async postUserHandler(request, h) {
  //   try {
  //     const { username, password, fullname } = request.payload;
  //     const userId = await this._service.addUser({
  //       username,
  //       password,
  //       fullname,
  //     });

  //     return h
  //       .response({
  //         status: "success",
  //         message: "user registered.",
  //         data: {
  //           userId,
  //         },
  //       })
  //       .code(201);
  //   } catch (error) {
  //     if (error instanceof ClientError) {
  //       return h
  //         .response({
  //           status: "fail",
  //           message: error.message,
  //         })
  //         .code(error.statusCode);
  //     }

  //     console.error(error);
  //     return h
  //       .response({
  //         status: "error",
  //         message: "An internal server error occurred",
  //       })
  //       .code(500);
  //   }
  // }

  async getAllUsers(request, h) {
    try {
      const { limit, offset } = request.query;
      const { users, totalData } = await this._service.getAllUsers({
        limit,
        offset,
      });
      const totalPages = Math.ceil(totalData / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      return {
        status: "success",
        data: {
          users,
        },
        pagination: {
          totalData,
          totalPages,
          currentPage,
          dataPerPage: limit,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }

      console.error(error);
      return h
        .response({
          status: "error",
          message: "An internal server error occurred",
        })
        .code(500);
    }
  }

  async getUserByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const user = await this._service.getUserById(id);

      return h.response({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }

      console.error(error);
      return h
        .response({
          status: "error",
          message: "An internal server error occurred",
        })
        .code(500);
    }
  }
}

export default UsersHandler;
