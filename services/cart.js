const Cart = require("../models/cart");
const Product = require("../models/products");

const addCartService = async (productId, userId, quantity) => {
	try {
		if (!productId || !userId || !quantity) {
			throw new Error("Missing details");
		}

		const exists = await Cart.findOne({ where: { productId, userId } });

		const product = await Product.findOne({ where: { id: productId } });
		if (!product) {
			throw new Error("Product not found");
		}

		if (exists) {
			const cartQuantity = exists.quantity + quantity;
			await Cart.update(
				{ quantity: cartQuantity },
				{ where: { productId, userId } }
			);

			// Calculate new product quantity and sales count
			const newQuantity = product.quantity - quantity;
			const newSalesCount = product.salesCount + quantity;

			await Product.update(
				{
					quantity: newQuantity,
					salesCount: newSalesCount,
				},
				{ where: { id: productId } }
			);

			return { message: "Cart successfully updated!" };
		}

		await Cart.create({
			userId,
			productId,
			quantity,
		});

		// Calculate new product quantity and sales count
		const newQuantity = product.quantity - quantity;
		const newSalesCount = product.salesCount + quantity;

		await Product.update(
			{
				quantity: newQuantity,
				salesCount: newSalesCount,
			},
			{ where: { id: productId } }
		);

		return { message: "Item successfully added to cart!" };
	} catch (error) {
		throw new Error(error.message);
	}
};

const updateCartService = async (userId, data) => {
	try {
		// Validate input data
		if (!Array.isArray(data)) {
			throw new Error("Invalid input: 'data' must be an array!");
		}

		for (const item of data) {
			const { productId, quantity } = item;

			// Validate each product entry
			if (!productId || typeof quantity !== "number" || quantity <= 0) {
				throw new Error(
					`Invalid product ID or quantity for product ${productId}!`
				);
			}

			// Find the user's cart item for the given product
			const cartItem = await Cart.findOne({
				where: { userId, productId },
			});

			// Check if the product exists in the database
			const product = await Product.findOne({
				where: { id: productId },
			});
			if (!product) {
				throw new Error(`Product with ID ${productId} not found!`);
			}

			// Check if the requested quantity exceeds available stock
			if (quantity > product.quantity) {
				throw new Error(
					`Only ${product.quantity} items are in stock for product ${productId}!`
				);
			}

			// Handle cart update logic
			if (cartItem) {
				// Update existing cart item
				const newCartQuantity = cartItem.quantity + quantity;

				if (newCartQuantity <= 0) {
					// Remove the item from the cart if the quantity becomes zero or negative
					await Cart.destroy({ where: { userId, productId } });
				} else {
					// Update the cart item with the new quantity
					await Cart.update(
						{ quantity: newCartQuantity },
						{ where: { userId, productId } }
					);
				}
			} else {
				// Add a new item to the cart
				await Cart.create({ userId, productId, quantity });
			}

			// Update product stock and sales count
			const stockChange = quantity; // Positive for adding, negative for reducing
			const newStock = product.quantity - stockChange;
			const newSalesCount = product.salesCount + Math.abs(stockChange);

			await Product.update(
				{
					quantity: newStock,
					salesCount: newSalesCount,
				},
				{ where: { id: productId } }
			);
		}

		return { message: "Cart successfully updated!" };
	} catch (error) {
		throw new Error(error.message);
	}
};

const deleteCartService = async (cartId) => {
	try {
		const cartItem = await Cart.findOne({ where: { id: cartId } });

		if (!cartItem) {
			return { message: "Item not found!" };
		}

		const product = await Product.findOne({
			where: { id: cartItem.productId },
		});
		if (!product) {
			return { message: "Product not found!" };
		}

		// Calculate updated quantity and sales count
		const updatedProductQuantity = product.quantity + cartItem.quantity;
		const updatedProductSalesCount = product.salesCount - cartItem.quantity;

		if (updatedProductSalesCount < 0) {
			return { message: "Sales count cannot be less than zero!" };
		}

		const cartDeleteResult = await Cart.destroy({ where: { id: cartId } });
		if (!cartDeleteResult) {
			return { message: "Failed to delete cart item." };
		}

		const productUpdateResult = await Product.update(
			{
				quantity: updatedProductQuantity,
				salesCount: updatedProductSalesCount,
			},
			{ where: { id: cartItem.productId } }
		);

		if (productUpdateResult[0] === 0) {
			return { message: "Failed to update product details." };
		}

		return { message: "Item successfully deleted and product updated!" };
	} catch (error) {
		console.error("Error in deleteCartService:", error);
		throw new Error(
			"An error occurred while deleting the item from the cart and updating the product."
		);
	}
};

const getCartServices = async (userId) => {
	try {
		const cartItems = await Cart.findAll({
			where: { userId },
		});

		if (!cartItems || cartItems.length === 0) {
			return { message: "No cart items found!" };
		}

		const productIds = cartItems.map((item) => item.productId);

		const products = await Product.findAll({
			where: { id: productIds },
			attributes: ["id", "name", "offerPrice", "images"],
		});

		const result = cartItems.map((item) => {
			const product = products.find((p) => p.id === item.productId);

			const imgs = product.images ? JSON.parse(product.images) : [];
			const imageUrl = imgs.map((img) => `http://localhost:4000/${img}`);

			return {
				id: item.id,
				img: imageUrl[0] || null,
				product: product.name,
				price: product.offerPrice,
				quantity: item.quantity,
			};
		});

		return result;
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = {
	addCartService,
	updateCartService,
	deleteCartService,
	getCartServices,
};
