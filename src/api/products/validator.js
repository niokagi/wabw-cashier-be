import Joi from "joi";

export const ProductPayloadSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
});
