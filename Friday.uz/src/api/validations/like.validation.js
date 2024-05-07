const Joi = require("joi");
const { v4 } = require("uuid");

const likeValidation = (like) => {
  const Likes = Joi.object({
    user_id: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required(),
    product_id: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required(),
  });
  const { error } = Likes.validate(like);
  return error;
};

module.exports = likeValidation;