const {
	getAllProductsService,
	getAllBestSellingsService,
	getScrollListProductsService,
	getExploreProductsService,
	getWishListService,
} = require("../services/productService");

const getAllProductsController = async (req, res) => {
	try {
		const response = await getAllProductsService();
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};
const getAllBestSellingsController = async (req, res) => {
	try {
		const response = await getAllBestSellingsService();
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};
const getScrollListProductsController = async (req, res) => {
	try {
		const response = await getScrollListProductsService();
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};
const getExploreProductsController = async (req, res) => {
	try {
		const response = await getExploreProductsService();
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};
const getWishListController = async (req, res) => {
	try {
		const response = await getWishListService();
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

module.exports = {
	getAllProductsController,
	getAllBestSellingsController,
	getScrollListProductsController,
	getExploreProductsController,
	getWishListController,
};
