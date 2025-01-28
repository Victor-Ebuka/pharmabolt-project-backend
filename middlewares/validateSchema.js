/**
 * Middleware function to validate request body against a specified schema.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @returns {function} Express middleware that validates the request body.
 * @throws {Response} Returns a 400 HTTP response with validation errors if validation fails.
 */
const validateSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

export default validateSchema;
