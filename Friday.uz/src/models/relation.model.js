const Admins = require("./admin.model");
const Category = require("./category.model");
const Products = require("./product.model");
const Sellers = require("./seller.model");
const Users = require("./user.model");

const relations = () => {
  Admins.hasMany(Category, { foreignKey: "admin_id" });
  Category.belongsTo(Admins, { foreignKey: "admin_id" });

  Category.hasMany(Products, { foreignKey: "category_id" });
  Products.belongsTo(Category, { foreignKey: "category_id" });

  Sellers.hasMany(Products, { foreignKey: "seller_id" });
  Products.belongsTo(Sellers, { foreignKey: "seller_id" });

  Products.belongsToMany(Users, {
    through: "user_to_product",
  });

  Users.belongsToMany(Products, {
    through: "user_to_product",
  });

  Products.belongsToMany(Users, {
    through: "user_to_bascket",
  });

  Users.belongsToMany(Products, {
    through: "user_to_bascket",
  });
};

module.exports = relations;
