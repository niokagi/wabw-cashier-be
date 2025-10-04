import Joi from "joi";
import { UserPayloadSchema } from "./validator.js";

const ADMIN_AUTH_CONFIG = {
  strategy: "jwt_strategy",
  scope: ['ADMIN', 'SUPER_ADMIN'],
}

const userRoutes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
    options: {
      auth: ADMIN_AUTH_CONFIG,
      validate: {
        payload: UserPayloadSchema,
      },
      cache: {
        expiresIn: 30 * 1000,
        privacy: 'private'
      },
      description: 'Register a new user (Admin/Super Admin only)',
      tags: ['api', 'users'],
    },
  },
  {
    method: "GET",
    path: "/users",
    handler: handler.getAllUsers,
    options: {
      // privillege role filter
      auth: ADMIN_AUTH_CONFIG,
      validate: {
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(10),
          offset: Joi.number().integer().min(0).default(0),
        }),
      },
      description: 'getting all users data list',
      tags: ['api', 'users'],
    },
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: handler.getUserByIdHandler,
    options: {
      auth: "jwt_strategy",
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
      },
      description: 'get user by id',
      tags: ['api', 'users'],
    },
  },
  // u can add more route paths..
];

export default userRoutes;
