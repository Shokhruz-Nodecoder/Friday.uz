const Joi = require("joi");

const login2Validation = (code) => {
  const Verification = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
  });
  const { error } = Verification.validate(code);
  return error;
};

module.exports = login2Validation;
