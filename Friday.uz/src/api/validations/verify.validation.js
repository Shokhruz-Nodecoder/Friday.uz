const Joi = require("joi");

const verificationValidation = (code) => {
    const Verification = Joi.object({
      verification: Joi.string().max(5).required(),
    });
    const { error } = Verification.validate(code);
    return error;
  };

  module.exports = verificationValidation;