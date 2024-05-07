const CustomError = require("../../libs/customError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.status).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = errorHandler;
