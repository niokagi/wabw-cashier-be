import Joi from "joi";

export const trxPayloadSchema = Joi.object({
  id: Joi.string().required(),
  user_id: Joi.string().required(),
  product_id: Joi.string().required(),
  //   add more
});
