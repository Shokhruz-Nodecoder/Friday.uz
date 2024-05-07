const Joi = require("joi");

const productValidation = (productData) => {
  const schema = Joi.object({
    name: Joi.string().max(64).required(),
    info: Joi.string().max(255).required(),
    image: Joi.string().max(64).required(),
    price: Joi.number().integer().required(),
    brand: Joi.string().max(255).required(),
  });

  const { error } = schema.validate(productData);
  return error;
};

module.exports = productValidation;