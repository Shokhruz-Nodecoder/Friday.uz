const CustomError = require("../../libs/customError");
const Products = require("../../models/product.model");
const Users = require("../../models/user.model");
const likeValidation = require("../validations/like.validation");



const createBasket = async (req, res, next) => {
  try {
    const user_id = req.user;

    const product_id = req.params?.product_id;
    if (!product_id) throw new CustomError(403, "Invalid product_id");

    const validationError = likeValidation({
      user_id,
      product_id,
    });
    if (validationError) throw new CustomError(400, validationError.message);

    const findUser = await Users.findByPk(user_id);
    if (!findUser) {
      throw new CustomError(400, "User not found");
    }

    const findProduct = await Products.findByPk(product_id, { logging: false });
    if (!findProduct) throw new CustomError(400, "Product not found");

    // Use the "user_to_bascket" association explicitly to add the product to the basket
    const createBasket = await findUser.addProducts([findProduct], {
      logging: false,
      through: {
        as: 'user_to_bascket', // Specify the correct alias for the basket association
      },
    });
  
    res
      .status(201)
      .json({ message: "Basket successfully added", createBasket });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


const getBaskets = async (req, res, next) => {
  try {
    const id = req.user;
    const backets = await Users.findOne({ where: { id }, logging: false });

    const backetsProducts = await backets.getProducts();
    res.status(201).json({ message: "Succes", backetsProducts });
  } catch (error) {
    next(error);
  }
};


module.exports = {createBasket, getBaskets}