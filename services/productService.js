const Products = require("../models/products");
const History = require("../models/history");
const Wishlist = require("../models/wishlist");
const { Sequelize, Op } = require("sequelize");

const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]]; // Swap elements
	}
	return array;
};
const formatProducts = (products) => {
	return products.map((product) => {
		const imgs = product.images ? JSON.parse(product.images) : [];
		const imageUrl = imgs.map((img) => `http://localhost:4000/${img}`);
		return {
			id: product.id,
			imageUrl,
			name: product.name,
			category: product.category,
			sub_category: product.subCategory,
			brand: product.brand,
			desc: product.description,
			price: parseFloat(product.price),
			amountLeft: product.quantity,
			salesCount: product.salesCount,
			ratings: product.ratings,
			ratingsCount: product.ratingsCount,
			offerPrice: parseFloat(product.offerPrice),
			quantity: product.quantity,
			variantType: product.variantType ? JSON.parse(product.variantType) : [],
		};
	});
};

//
const insertProductsService = async () => {
	try {
		const products = await Products.bulkCreate([
			{
				name: "Wireless Bluetooth Headphones",
				description: "Noise-canceling over-ear headphones with deep bass.",
				category: "Electronics",
				subCategory: "Headphones",
				brand: "Sony",
				price: 99.99,
				offerPrice: 79.99,
				quantity: 50,
				variantType: { color: ["black", "white", "blue"] },
				images: ["image1.jpg", "image2.jpg"],
				ratings: 4,
				ratingsCount: 250,
				salesCount: 150,
			},
			{
				name: "Gaming Laptop",
				description: "High-performance gaming laptop with RTX 3060 GPU.",
				category: "Computers",
				subCategory: "Laptops",
				brand: "ASUS",
				price: 1499.99,
				offerPrice: 1399.99,
				quantity: 20,
				variantType: {
					RAM: ["16GB", "32GB"],
					Storage: ["512GB SSD", "1TB SSD"],
				},
				images: ["laptop1.jpg", "laptop2.jpg"],
				ratings: 5,
				ratingsCount: 120,
				salesCount: 80,
			},
		]);
	} catch (error) {
		throw new Error(error.message);
	}
};

const getAllProductsService = async () => {
	try {
		const products = await Products.findAll({
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});

		if (products.length === 0) {
			throw new Error("No products found");
		}

		return formatProducts(products);
	} catch (error) {
		throw new Error(error.message);
	}
};

const getAllBestSellingsService = async () => {
	try {
		const products = await Products.findAll({
			order: [["salesCount", "DESC"]],
			limit: 8,
		});

		if (products.length === 0) {
			throw new Error("No products found");
		}

		return formatProducts(products);
	} catch (error) {
		throw new Error(error.message);
	}
};

const getScrollListProductsService = async () => {
	try {
		const products = await Products.findAll({
			order: [Sequelize.literal("RAND()")],
			limit: 8,
		});

		if (products.length === 0) {
			throw new Error("No products found");
		}

		return formatProducts(products);
	} catch (error) {
		throw new Error(error.message);
	}
};

const getExploreProductsService = async () => {
	try {
		const products = await Products.findAll({
			where: {
				quantity: { [Op.gt]: 0 },
			},
			order: [Sequelize.literal("RAND()")],
			limit: 16,
		});

		if (products.length === 0) {
			throw new Error("No products found");
		}

		return formatProducts(products);
	} catch (error) {
		throw new Error(error.message);
	}
};

const addHistoryService = async (productId, userId) => {
	try {
		if (!productId || !userId) {
			throw new Error("product id and user id cannot be blank");
		}
		//check if history exists
		const exists = await History.findOne({ where: { userId, productId } });
		if (exists) {
			throw new Error("History already exist");
		}
		console.log("peter");
		const create = await History.create({
			productId,
			userId,
		});
		return create;
	} catch (error) {
		throw new Error(error.message);
	}
};

const getHistoryService = async (userId) => {
	try {
		if (!userId) {
			throw new Error("User id is required");
		}

		const historyItems = await History.findAll({
			where: { userId },
		});

		console.log("History Items:", historyItems);
		const productIds = historyItems.map((item) => item.productId);
		console.log("Product IDs from history:", productIds); // Debugging

		const products = await Products.findAll({
			where: { id: { [Op.in]: productIds } },
		});
		console.log("Products Found:", products); // Debugging

		return formatProducts(products);
	} catch (error) {
		throw new Error(error.message);
	}
};

const getHistoryRelatedService = async (userId) => {
	try {
		if (!userId) {
			throw new Error("User ID cannot be blank");
		}

		const history = await History.findAll({ where: { userId } });

		if (history.length > 0) {
			const productIds = history.map((item) => item.productId);

			const relatedProducts = await Products.findAll({
				where: {
					id: {
						[Op.in]: productIds,
					},
				},
			});

			const recommendedProducts = await Products.findAll({
				where: {
					category: {
						[Op.in]: relatedProducts.map((p) => p.category),
					},
				},
				limit: 20,
			});

			return formatProducts(recommendedProducts);
		} else {
			const allProducts = await Products.findAll({
				limit: 100,
			});

			const shuffledProducts = shuffleArray(allProducts);

			return formatProducts(shuffledProducts.slice(0, 20));
		}
	} catch (error) {
		throw new Error(error.message);
	}
};

const addWishlistService = async (userId, productId) => {
	try {
		if (!userId || !productId) {
			throw new Error("User id and product id required");
		}
		const exists = await Wishlist.findOne({ where: { userId, productId } });
		if (exists) {
			throw new Error("Product already in wishlist");
		}
		const create = await Wishlist.create({
			userId,
			productId,
		});
		return create;
	} catch (error) {
		throw new Error(error.message);
	}
};

const getWishlistService = async (userId) => {
	try {
		if (!userId) {
			throw new Error("User id is required");
		}

		const wishlistItems = await Wishlist.findAll({
			where: { userId },
		});

		console.log("Wishlist Items:", wishlistItems);

		const wishlistItemsIds = wishlistItems.map((item) => item.productId);
		console.log("Product IDs from history:", wishlistItemsIds); // Debugging

		const products = await Products.findAll({
			where: { id: { [Op.in]: wishlistItemsIds } },
		});
		if (products.length === 0) {
			throw new Error("No wishlist found");
		}
		console.log("Wishlist Found:", products); // Debugging

		return formatProducts(products);
	} catch (error) {
		throw new Error(error.message);
	}
};

const removeWishlistService = async (userId, productId) => {
	try {
		if (!userId || !productId) {
			throw new Error("User id and product id required");
		}
		const exists = await Wishlist.findOne({ where: { userId, productId } });
		if (!exists) {
			throw new Error("Product not in wishlist");
		}
		const remove = await Wishlist.destroy({ where: { userId, productId } });
		return remove;
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = {
	getAllProductsService,
	insertProductsService,
	getAllBestSellingsService,
	getScrollListProductsService,
	getExploreProductsService,
	addHistoryService,
	getHistoryService,
	getHistoryRelatedService,
	getWishlistService,
	addWishlistService,
	removeWishlistService,
};
