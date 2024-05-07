const { v4 } = require("uuid");
const Products = require("../../models/product.model");
const Category = require("../../models/category.model");
const { extname } = require("path");
const productValidation = require("../validations/product.validation");
const CustomError = require("../../libs/customError");
const Sellers = require("../../models/seller.model");

const create = async (req, res, next) => {
  try {
    const { info, name, price, brand } = req.body;
    const seller_id = req.user;
    console.log(seller_id);
    const category_id = req.params?.id;

    if (!category_id) throw new CustomError(400, "CategoryId is required");
    const category = await Category.findByPk(category_id);
    if (!category) throw new CustomError(400, "CategoryId not found");

    const file = req.files?.image;
    if (!file) throw new CustomError(400, "File is required");

    const imageName = `${v4()}${extname(file.name)}`;
    file.mv(process.cwd() + "/uploads/" + imageName);
    const validationError = productValidation({
      name,
      info,
      price,
      image: imageName,
      brand,
    });
    if (validationError) throw new CustomError(400, validationError.message);

    const findProduct = await Products.findAll({
      where: { name, brand, price },
      logging: false,
    });
    if (findProduct.length > 0)
      throw new CustomError(400, "Product already exists");

    const newProduct = await Products.create(
      { name, brand, price, image: imageName, info, category_id, seller_id },
      { logging: false }
    );
    res.status(200).json({ message: "Success", newProduct });
  } catch (error) {
    next(error);
  }
};

const getAllproducts = async (req, res, next) => {
  try {
    const products = await Products.findAll({
      include: [
        Category,
        {
          model: Sellers,
          attributes: [
            "id",
            "firstname",
            "lastname",
            "email",
            "phone_number",
            "company_name",
            "INN",
            "created_at",
            "updated_at",
          ],
        },
      ],
    });
    res.status(200).json({ message: "Success", products });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Products.findByPk(
      id,
      {
        include: [
          Category,
          {
            model: Sellers,
            attributes: [
              "id",
              "firstname",
              "lastname",
              "email",
              "phone_number",
              "company_name",
              "INN",
              "created_at",
              "updated_at",
            ],
          },
        ],
      },
      { logging: false }
    );
    res.status(200).json({ message: "Success", product });
  } catch (error) {
    next(error);
  }
};

const updatedProduct = async (req, res, next) => {
  try {
    const { info, name, price, brand } = req.body;
    const { pro_id } = req.params;

    const seller_id = req.user;

    const category_id = req.params?.id;

    if (!category_id) throw new CustomError(400, "CategoryId is required");
    const category = await Category.findByPk(category_id);
    if (!category) throw new CustomError(400, "CategoryId not found");

    const file = req.files?.image;
    if (!file) throw new CustomError(400, "File is required");

    const imageName = `${v4()}${extname(file.name)}`;
    file.mv(process.cwd() + "/uploads/" + imageName);
    const validationError = productValidation({
      name,
      info,
      price,
      image: imageName,
      brand,
    });
    if (validationError) throw new CustomError(400, validationError.message);

    const findProduct = await Products.findByPk(pro_id);

    if (findProduct) {
      const [rowsUpdated, [updatedProduct]] = await Products.update(req.body, {
        where: { id: pro_id },
        returning: true,
        logging: false,
      });

      if (rowsUpdated === 1) {
        res
          .status(200)
          .json({ message: "Updated successfully", updatedProduct });
      } else {
        throw new CustomError(400, "Product not found");
      }
    } else {
      throw new CustomError(400, "Product not found");
    }
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);

    const deletePro = await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  create,
  getAllproducts,
  getOne,
  updatedProduct,
  deleteProduct,
};
