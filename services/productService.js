const Products = require("../models/products");
const History = require("../models/history");
const Wishlist = require("../models/wishlist");
const { Sequelize, Op } = require("sequelize");
const Rating = require("../models/rating");

const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]]; // Swap elements
	}
	return array;
};

const formatProducts = async (products) => {
	// Wait for all promises to resolve
	const formattedProducts = await Promise.all(products.map(async (product) => {
		const imgs = product.images ? JSON.parse(product.images) : [];
		const imageUrl = imgs.map((img) => `http://localhost:4000/${img}`);

		const variantType = product.variantType ? JSON.parse(product.variantType) : {};
		const variantArray = Object.entries(variantType).map(([key, values]) => ({
			name: key,
			options: values,
		}));

		// Fetch sum of ratings and count of ratings for the product
		const ratingData = await Rating.findOne({
			attributes: [
				[Sequelize.fn("SUM", Sequelize.col("rating")), "totalRating"],
				[Sequelize.fn("COUNT", Sequelize.col("rating")), "ratingCount"],
			],
			where: { productId: product.id }
		});



		const totalRating = ratingData?.dataValues?.totalRating || 0;
		const ratingCount = ratingData?.dataValues?.ratingCount || 0;
		const averageRating = ratingCount > 0 ? Math.round(totalRating / ratingCount) : 0;

		return {
			id: product.id,
			images: imageUrl,
			name: product.name,
			category: product.category,
			subcategory: product.subCategory,
			brand: product.brand,
			desc: product.description,
			price: parseFloat(product.price),
			amountLeft: product.quantity,
			salesCount: product.salesCount,
			ratings: averageRating,
			ratingsCount: ratingCount,
			offerPrice: parseFloat(product.offerPrice),
			quantity: product.quantity,
			variantType: variantArray,
		};
	}));

	return formattedProducts; // Ensure the function returns the resolved data
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
			order: [['id', 'DESC']],
		});

		const productIds = historyItems.map((item) => item.productId);

		const products = await Products.findAll({
			where: { id: { [Op.in]: productIds } },
		});

		// Sort products based on history order
		const productMap = new Map(products.map(product => [product.id, product]));
		const sortedProducts = productIds.map(id => productMap.get(id));

		return formatProducts(sortedProducts);
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
					id: {
						[Op.notIn]: productIds, // Exclude history products
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
			order: [['id', 'DESC']],
		});

		console.log("Wishlist Items:", wishlistItems);

		const wishlistItemsIds = wishlistItems.map((item) => item.productId);

		const products = await Products.findAll({
			where: { id: { [Op.in]: wishlistItemsIds } },
		});
		if (products.length === 0) {
			throw new Error("No wishlist found");
		}
		// Sort products based on history order
		const productMap = new Map(products.map(product => [product.id, product]));
		const sortedProducts = wishlistItemsIds.map(id => productMap.get(id));

		return formatProducts(sortedProducts);
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

const getWishlistRelatedService = async (userId) => {
	try {
		if (!userId) {
			throw new Error("User ID cannot be blank");
		}

		const wishlist = await Wishlist.findAll({ where: { userId } });

		if (wishlist.length > 0) {
			const productIds = wishlist.map((item) => item.productId);

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
					id: {
						[Op.notIn]: productIds,
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

const rateProductService = async (userId, productId, rating) => {
	try {
		if (!userId || !productId || !rating) {
			throw new Error('All details are required')
		}
		const product = await Products.findOne({ where: { id: productId } });

		//check if user has already rated the product
		const hasRated = await Rating.findOne({ where: { userId, productId } });
		if (hasRated) {
			//update the ratings
			const update = await Rating.update({ rating }, { where: { userId, productId } });
			return update;
		}
		const upadatedCount = product.ratingsCount + 1;

		await Rating.create({ userId, productId, rating });
		const rate = await Products.update({ ratingsCount: upadatedCount }, { where: { id: productId } })
		return rate;
	} catch (error) {
		throw new Error(error.message);
	}
}
module.exports = {
	getAllProductsService,
	getAllBestSellingsService,
	getScrollListProductsService,
	getExploreProductsService,
	addHistoryService,
	getHistoryService,
	getHistoryRelatedService,
	getWishlistService,
	addWishlistService,
	removeWishlistService,
	getWishlistRelatedService,
	rateProductService
};
