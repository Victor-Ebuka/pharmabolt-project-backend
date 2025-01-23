import Joi from "joi";

export const createUserSchema = Joi.object({
  full_name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().max(255).required(),
  phone_no: Joi.string().min(3).max(255).required(),
  password: Joi.string().min(8).max(255).required(),
  address: Joi.string().min(3).max(255).required(),
  city: Joi.string().min(3).max(255).required(),
  state: Joi.string().min(3).max(255).required(),
  role: Joi.string().valid("admin", "user"),
});

export const updateUserSchema = Joi.object({
  full_name: Joi.string().min(3).max(255),
  email: Joi.string().email().max(255),
  phone_no: Joi.string().min(3).max(255),
  password: Joi.string().min(8).max(255),
  address: Joi.string().min(3).max(255),
  city: Joi.string().min(3).max(255),
  state: Joi.string().min(3).max(255),
  role: Joi.string().valid("admin", "user"),
});
