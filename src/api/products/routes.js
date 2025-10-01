import Joi from "joi";
import { ProductPayloadSchema } from "./validator";

export const productsRoutes = (handler) => [
  {
    method: "POST",
    path: "/products",
    handler: handler.postProductHandler,
    options: {
      validate: {
        payload: ProductPayloadSchema,
      },
    },
  },
  // {
  //   method: "GET",
  //   path: "/products",
  //   handler: handler.getProductHandler,
  //   options: {
  //     validate: {
  //       query: Joi.object({
  //         limit: Joi.number().integer().min(1).default(10),
  //         offset: Joi.number().integer().min(0).default(0),
  //       }),
  //     },
  //   },
  // },
  // {
  //   method: "GET",
  //   path: "/products/{id}",
  //   handler: handler.getProductByIdHandler,
  //   options: {
  //     validate: {
  //       params: Joi.object({
  //         id: Joi.string().required(),
  //       }),
  //     },
  //   },
  // },
];
