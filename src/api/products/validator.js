import Joi from "joi";

export const ProductPayloadSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  price: Joi.number().positive().required(),
  category: Joi.string()
    .valid("FOOD", "BEVERAGE", "SNACK", "DESSERT")
    .required(),
  stock: Joi.number().integer().min(0).required(),
});
