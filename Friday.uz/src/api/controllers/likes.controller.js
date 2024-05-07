const CustomError = require("../../libs/customError");
const Products = require("../../models/product.model");
const Users = require("../../models/user.model");
const likeValidation = require("../validations/like.validation");

const likes = async (req, res, next) => {
  try {
    const user_id = req.user;
    const product_id = req.params?.product_id;
    const validationError = likeValidation({
      user_id,
      product_id,
    });
    if (validationError) throw new CustomError(400, validationError.message);

    const findUser = await Users.findByPk(user_id);
    if (!findUser) {
      throw new CustomError(400, "User not found");
    }

    const findProduct = await Products.findByPk(product_id);
    if (!findProduct) throw new CustomError(400, "Product not found");

    const createLike = await findUser.addProducts([findProduct]);

    res.status(201).json({ message: "Likes crated" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getLikes = async (req, res, next) => {
  try {
    const id = req.user;
    const user = await Users.findOne({ where: { id } });

    const likedProducts = await user.getProducts();
    res.status(201).json({ message: "Succes", likedProducts });
  } catch (error) {
    next(error);
  }
};

module.exports = { likes, getLikes };
