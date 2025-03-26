const {
	addCartService,
	updateCartService,
	deleteCartService,
	getCartServices,
} = require("../services/cart");

const addCartController = async (req, res) => {
	try {
		const { productId, userId, quantity } = req.body;

		const response = await addCartService(productId, userId, quantity);
		return res.status(200).json(response);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const updateCartController = async (req, res) => {
	try {
		const { userId } = req.params;
		const { data } = req.body;

		// Validate that userId is provided
		if (!userId) {
			return res.status(400).json({ error: "User ID is required!" });
		}
		const response = await updateCartService(userId, data);
		return res.status(200).json(response);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

const deleteCartController = async (req, res) => {
	try {
		const { cartId } = req.query;

		// Validate that userId is provided
		if (!cartId) {
			return res.status(400).json({ error: "Cart ID is required!" });
		}

		const response = await deleteCartService(cartId);
		return res.status(200).json(response);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const getCartController = async (req, res) => {
	try {
		const { userId } = req.query;
		// Validate that userId is provided
		if (!userId) {
			return res.status(400).json({ error: "User ID is required!" });
		}
		const response = await getCartServices(userId);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	addCartController,
	updateCartController,
	deleteCartController,
	getCartController,
};
