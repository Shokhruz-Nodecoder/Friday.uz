const { Router } = require("express");
const isUser = require("../middlewares/isUser.middleware");
const {
  balanceFilling,
  purchasing,
} = require("../controllers/shopping.controller");

const router = Router();

router.post("/balancefill", isUser, balanceFilling);
router.post("/user/payment/:product_id", isUser, purchasing);

module.exports = router;
