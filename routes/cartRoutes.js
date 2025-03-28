const express = require("express");
const {
	addCartController,
	updateCartController,
	deleteCartController,
	getCartController,
} = require("../controllers/cart");

const router = express.Router();

router.post("/new", addCartController);
router.post("/update-cart/:userId", updateCartController);
router.delete("/remove", deleteCartController);
router.get("/all/:userId", getCartController);

module.exports = router;
