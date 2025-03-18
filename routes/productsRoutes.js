const express = require("express");
const {
	getAllProductsController,
	getAllBestSellingsController,
	getScrollListProductsController,
	getExploreProductsController,
	getWishListController,
} = require("../controllers/productController");

const router = express.Router();

router.get("/allproducts", getAllProductsController);
router.get("/bestsellings", getAllBestSellingsController);
router.get("/scrolllist", getScrollListProductsController);
router.get("/explore", getExploreProductsController);
router.get("/wishlist", getWishListController);

module.exports = router;
