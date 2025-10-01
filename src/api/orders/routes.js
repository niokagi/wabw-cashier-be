import trxHandler from "./handler";
import { trxPayloadSchema } from "./validator";

export const ordersRoutes = () => [
  {
    method: "POST",
    path: "/trx/{id}",
    handler: trxHandler,
    options: {
      validate: {
        payload: trxPayloadSchema,
      },
    },
  },
];
