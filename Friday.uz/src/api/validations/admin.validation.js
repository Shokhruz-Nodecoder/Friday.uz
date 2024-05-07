const Joi = require("joi");

const adminValidation = (user) => {
  const User = Joi.object({
    username: Joi.string().max(32).required(),
    password: Joi.string().min(4).required(),
  });
  const { error } = User.validate(user);
  return error;
};

module.exports = adminValidation;
