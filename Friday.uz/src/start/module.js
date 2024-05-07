const routes = require("../api/routes");
const cors = require("cors");
const express = require("express");
const fileupload = require("express-fileupload");
const errorHandler = require("./../api/middlewares/errorHandler.middleware");
const cookieParser = require("cookie-parser");
const relations = require("../models/relation.model");

const modules = async (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(fileupload());
  app.use(express.static(process.cwd() + "/uploads"));

  app.use(routes);
  relations();
  app.use(errorHandler);
};

module.exports = modules;
