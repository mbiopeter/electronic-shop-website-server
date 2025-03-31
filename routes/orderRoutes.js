const express = require("express");
const router = express.Router();
const {
	createOrderController,
	getOrderController,
	getOrdersWithProductsController,
} = require("../controllers/orderController");

router.post("/new", createOrderController);
router.get("/one/:orderId", getOrderController);
router.get("/order-details/:orderId", getOrdersWithProductsController);

module.exports = router;
