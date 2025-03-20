const {
	getAllProductsService,
	getAllBestSellingsService,
	getScrollListProductsService,
	getExploreProductsService,
	getWishlistService,
	addHistoryService,
	getHistoryService,
	getHistoryRelatedService,
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
		const { userId } = req.query;
		const response = await getWishlistService(userId);
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const addHistoryController = async (req, res) => {
	try {
		const { productId, userId } = req.body;
		await addHistoryService(productId, userId);
		res.status(200).json({ message: "History created" });
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getHistoryController = async (req, res) => {
	try {
		const { userId } = req.query;
		const response = await getHistoryService(userId);
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getHistoryRelatedController = async (req, res) => {
	try {
		const { userId } = req.query;
		const response = await getHistoryRelatedService(userId);
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
	addHistoryController,
	getHistoryController,
	getHistoryRelatedController,
};
