const Joi = require("joi");

const categoryValidation = (name) => {
  const Category = Joi.object({
    name: Joi.string().max(64).min(4).required(),
  });
  const { error } = Category.validate(name);
  return error;
};

module.exports = categoryValidation;