const express = require("express");
const {
	getAllProductsController,
	getAllBestSellingsController,
	getScrollListProductsController,
	getExploreProductsController,
	getWishListController,
	addHistoryController,
	getHistoryController,
	getHistoryRelatedController
} = require("../controllers/productController");

const router = express.Router();

router.get("/allproducts", getAllProductsController);
router.get("/bestsellings", getAllBestSellingsController);
router.get("/scrolllist", getScrollListProductsController);
router.get("/explore", getExploreProductsController);
router.get("/wishlist", getWishListController);

router.post("/history/new", addHistoryController);
router.get("/history", getHistoryController);
router.get("/history/recomend", getHistoryRelatedController);

module.exports = router;
