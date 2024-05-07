const {Router} = require("express")
const { createBasket } = require("../controllers/bascket.controller")
const isUser = require("../middlewares/isUser.middleware")
const router = new Router()

router.post("/user/basket/:product_id",isUser, createBasket )

module.exports = router
