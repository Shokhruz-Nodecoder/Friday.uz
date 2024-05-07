const jwt = require("jsonwebtoken");
const config = require("config");

const SecretKey = config.get("jwt_key");

const sign = (payload) => jwt.sign(payload, SecretKey, { expiresIn: "24h" });
const verify = (payload) => jwt.verify(payload, SecretKey);

module.exports = {
  sign,
  verify,
};