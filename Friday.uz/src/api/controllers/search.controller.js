const { Op } = require("sequelize");
const Products = require("../../models/product.model");
const CustomError = require("../../libs/customError");
const Category = require("../../models/category.model");


const paginateProduct = async (req, res, next) => {
    try {
      const { page, limit } = req.query;
  
      const offset = (page - 1) * limit;
  
      const attributes = {
        exclude: ["created_at", "updated_at"],
      };
      const { rows, count } = await Products.findAndCountAll({
        attributes,
        limit,
        offset,
        logging: false,
      });
  
      res.status(200).json({
        message: "Success",
        rows,
        count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (error) {
      next(error);
    }
  };



const searchProduct = async (req, res, next) => {
  try {
    const { name, price, brand, fromPrice, toPrice } = req.query;

    let conditions = {};
    if (name) {
      conditions.name = { [Op.iLike]: `%${name}%` };
    }
    if (price) {
      conditions.price = parseFloat(price);
    }
    if (brand) {
      conditions.brand = { [Op.iLike]: `%${brand}%` };
    }
    if (fromPrice) {
      conditions.price = { ...conditions.price, [Op.gte]: fromPrice };
    }
    if (toPrice) {
      conditions.price = { ...conditions.price, [Op.lte]: toPrice };
    }
    const data = await Products.findAll({
      where: conditions,
      logging: false,
    });

    if (data.length == 0) throw new CustomError(404, "Product not found");

    return res.status(200).json({ message: "Success", data });
  } catch (error) {
    next(error);
  }
};

const searchCategory = async (req, res, next) => {
  try {
    const { name } = req.query;

    let conditions = {};

    if (name) {
      conditions.name = { [Op.iLike]: `%${name}%` };
    }

    const data = await Category.findAll({
      where: conditions,
      logging: false,
    });

    if (data.length == 0) throw new CustomError(404, "Category not found");

    return res.status(200).json({ message: "Success", data });
  } catch (error) {
    next(error);
  }
};
module.exports = { searchProduct, searchCategory,paginateProduct };