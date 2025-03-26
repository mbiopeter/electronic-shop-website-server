const {
	getAllProductsService,
	getAllBestSellingsService,
	getScrollListProductsService,
	getExploreProductsService,
	getWishlistService,
	addWishlistService,
	removeWishlistService,
	getWishlistRelatedService,
	addHistoryService,
	getHistoryService,
	getHistoryRelatedService,
	rateProductService
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
		const { id } = req.query;
		const response = await getHistoryService(id);

		if (response.length === 0) {
			throw new Error("No history found");
		}
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getHistoryRelatedController = async (req, res) => {
	try {
		const { id } = req.query;
		const response = await getHistoryRelatedService(id);
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const addWishlistController = async (req, res) => {
	try {
		const { userId, productId } = req.body;
		await addWishlistService(userId, productId);
		res.status(200).json({ message: "Added to wishlist" });
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getWishlistController = async (req, res) => {
	try {
		const { id } = req.query;
		const response = await getWishlistService(id);
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const removeWishlistController = async (req, res) => {
	try {
		const { userId, productId } = req.body;
		await removeWishlistService(userId, productId);
		res.status(200).json({ message: "Removed from wishlist" });
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getWishlistRelatedController = async (req, res) => {
	try {
		const { id } = req.query;
		const response = await getWishlistRelatedService(id);
		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		res.status(500).json(error.message);
	}
};

const rateProductController = async (req, res) => {
	try {
		const { userId, productId, rating } = req.body;
		await rateProductService(userId, productId, rating);
		res.status(200).json({ message: "rating created successfully!" })
	} catch (error) {
		res.status(500).json(error.message);
	}
}

module.exports = {
	getAllProductsController,
	getAllBestSellingsController,
	getScrollListProductsController,
	getExploreProductsController,
	getWishlistController,
	addHistoryController,
	getHistoryController,
	getHistoryRelatedController,
	addWishlistController,
	removeWishlistController,
	getWishlistRelatedController,
	rateProductController
};
