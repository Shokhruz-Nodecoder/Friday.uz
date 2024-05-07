const { Sequelize } = require("sequelize");
const sequlize = new Sequelize(
  "postgres://postgres:postgres@localhost:5432/sello"
);

module.exports = sequlize;
