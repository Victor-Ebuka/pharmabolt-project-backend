import Joi from "joi";

/**
 * Schema for validating drug creation request.
 * @typedef {Object} CreateDrugSchema
 * @property {string} name - The name of the drug. Must be a string with a minimum of 3 characters and a maximum of 255 characters.
 * @property {string} description - A description of the drug. Must be a string with a minimum of 5 characters.
 * @property {number} price - The price of the drug. Must be a number.
 * @property {number} stock - The stock quantity of the drug. Must be a number.
 */
const createDrugSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(5).required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
});

/**
 * Schema for validating drug update request.
 * @typedef {Object} UpdateDrugSchema
 * @property {string} [name] - The name of the drug. Optional, if provided it must be a string between 3 and 255 characters.
 * @property {string} [description] - A description of the drug. Optional, if provided it must be a string with at least 5 characters.
 * @property {number} [price] - The price of the drug. Optional, if provided it must be a number.
 * @property {number} [stock] - The stock quantity of the drug. Optional, if provided it must be a number.
 */
const updateDrugSchema = Joi.object({
  name: Joi.string().min(3).max(255),
  description: Joi.string().min(5),
  price: Joi.number(),
  stock: Joi.number(),
});

export default { createDrugSchema, updateDrugSchema };
