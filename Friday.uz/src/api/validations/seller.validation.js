const Joi = require("joi");

const sellerValidation = (seller) => {
  const User = Joi.object({
    firstname: Joi.string().max(32).required(),
    lastname: Joi.string().max(32).required(),
    password: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required(),
    company_name: Joi.string().required(),
    INN: Joi.string().required(),
  });
  const { error } = User.validate(seller);
  return error;
};

module.exports = sellerValidation;
