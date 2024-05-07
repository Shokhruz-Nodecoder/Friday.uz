const Joi = require("joi");

const authValidation = (user) => {
  const User = Joi.object({
    username: Joi.string().max(32).required(),
    password: Joi.string().min(4).required(),
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
  });
  const { error } = User.validate(user);
  return error;
};

module.exports = authValidation;
