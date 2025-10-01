import Joi from "joi";
import { UserPayloadSchema } from "./validator.js";

const userRoutes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
    options: {
      validate: {
        payload: UserPayloadSchema,
      },
    },
  },
  {
    method: "GET",
    path: "/users",
    handler: handler.getAllUsers,
    options: {
      // filtering role privilege for safe practice
      //
      // auth: {
      //   strategy: "jwt",
      //   scope: ["admin"],
      // },
      validate: {
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(10),
          offset: Joi.number().integer().min(0).default(0),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: handler.getUserByIdHandler,
    options: {
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
      },
    },
  },
  // u can add more route paths..
];

export default userRoutes;
