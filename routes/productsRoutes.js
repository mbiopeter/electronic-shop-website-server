const express = require("express");
const {
	getAllProductsController,
	getAllBestSellingsController,
	getScrollListProductsController,
	getExploreProductsController,
	addWishlistController,
	getWishlistController,
	removeWishlistController,
	addHistoryController,
	getHistoryController,
	getHistoryRelatedController,
	insertProductsController,
} = require("../controllers/productController");

const router = express.Router();

router.get("/allproducts", getAllProductsController);
router.get("/bestsellings", getAllBestSellingsController);
router.get("/scrolllist", getScrollListProductsController);
router.get("/explore", getExploreProductsController);
router.post("/wishlist/add", addWishlistController);
router.get("/wishlist/:userId", getWishlistController);
router.delete("/wishlist/remove", removeWishlistController);
router.post("/insert", insertProductsController);

router.post("/history/new", addHistoryController);
router.get("/history/:userId", getHistoryController);
router.get("/history/recomend", getHistoryRelatedController);

module.exports = router;
