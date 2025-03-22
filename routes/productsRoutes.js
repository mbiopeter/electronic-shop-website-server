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
	getWishlistRelatedController,
	rateProductController
} = require("../controllers/productController");

const router = express.Router();

router.get("/allproducts", getAllProductsController);
router.get("/bestsellings", getAllBestSellingsController);
router.get("/scrolllist", getScrollListProductsController);
router.get("/explore", getExploreProductsController);

router.post("/wishlist/add", addWishlistController);
router.get("/wishlist", getWishlistController);
router.delete("/wishlist/remove", removeWishlistController);
router.get("/wishlist/recomend", getWishlistRelatedController);

router.post("/history/new", addHistoryController);
router.get("/history", getHistoryController);
router.get("/history/recomend", getHistoryRelatedController);


router.post("/rating/create", rateProductController);


module.exports = router;
