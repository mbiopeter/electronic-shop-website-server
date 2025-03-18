const Products = require("../models/products");
const History = require('../models/history');
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
			limit: 8
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
			throw new Error("product id and user id cannot be blank")
		}
		//check if history exists
		const exists = await History.findOne({ where: { userId, productId } });
		if (exists) {
			throw new Error("History already exist");
		}
		console.log("peter");
		const create = await History.create({
			productId,
			userId
		})
		return create;
	} catch (error) {
		throw new Error(error.message);
	}
}

const getHistoryService = async (userId) => {
	try {
		if (!userId) {
			throw new Error('User id is required');
		}

		const historyItems = await History.findAll({
			where: { userId }
		});

		const productIds = historyItems.map(item => item.productId);

		const products = await Products.findAll({
			where: { id: productIds },
		});

		return formatProducts(products);
	} catch (error) {
		throw new Error(error.message);
	}
}

const getHistoryRelatedService = async (userId) => {
	try {
		if (!userId) {
			throw new Error("User ID cannot be blank");
		}

		const history = await History.findAll({ where: { userId } });

		if (history.length > 0) {
			const productIds = history.map(item => item.productId);

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
						[Op.in]: relatedProducts.map(p => p.category),
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


module.exports = {
	getAllProductsService,
	getAllBestSellingsService,
	getScrollListProductsService,
	getExploreProductsService,
	addHistoryService,
	getHistoryService,
	getHistoryRelatedService
};
