const Joi = require("joi");

const loginValidation = (code) => {
  const Verification = Joi.object({
    username: Joi.string().max(32).required(),
    password: Joi.string().min(4).required(),
  });
  const { error } = Verification.validate(code);
  return error;
};

module.exports = loginValidation;
