const express = require("express");
const {
	addCartController,
	updateCartController,
	deleteCartController,
	getCartController,
} = require("../controllers/cart");

const router = express.Router();

router.post("/new", addCartController);

router.post("/update-cart", updateCartController);
router.delete("/remove", deleteCartController);
router.get("/all", getCartController);

module.exports = router;
