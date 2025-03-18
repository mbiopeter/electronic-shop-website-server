const Products = require("../models/products");
const { Sequelize, Op } = require("sequelize");

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
		const formattedProducts = products.map((product) => {
			const imgs = product.images ? JSON.parse(product.images) : [];
			const imageUrl = imgs.map((img) => `http://localhost:4000/${img}`);
			return {
				id: product.id,
				img: imageUrl[0] || null,
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

		return formattedProducts;
	} catch (error) {
		throw new Error(error.message);
	}
};

const getAllBestSellingsService = async () => {
	try {
		const products = await Products.findAll({
			order: [["salesCount", "DESC"]],
		});

		if (products.length === 0) {
			throw new Error("No products found");
		}
		const formattedProducts = products.map((product) => {
			const imgs = product.images ? JSON.parse(product.images) : [];
			const imageUrl = imgs.map((img) => `http://localhost:4000/${img}`);
			return {
				id: product.id,
				img: imageUrl[0] || null,
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
		return formattedProducts;
	} catch (error) {
		throw new Error(error.message);
	}
};

const getScrollListProductsService = async () => {
	try {
		const products = await Products.findAll({
			order: [Sequelize.literal("RAND()")],
			limit: 20,
		});

		if (products.length === 0) {
			throw new Error("No products found");
		}
		const formattedProducts = products.map((product) => {
			const imgs = product.images ? JSON.parse(product.images) : [];
			const imageUrl = imgs.map((img) => `http://localhost:4000/${img}`);
			return {
				id: product.id,
				img: imageUrl[0] || null,
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
		return formattedProducts;
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
			limit: 20,
		});

		if (products.length === 0) {
			throw new Error("No products found");
		}
		const formattedProducts = products.map((product) => {
			const imgs = product.images ? JSON.parse(product.images) : [];
			const imageUrl = imgs.map((img) => `http://localhost:4000/${img}`);
			return {
				id: product.id,
				img: imageUrl[0] || null,
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

		return formattedProducts;
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = {
	getAllProductsService,
	getAllBestSellingsService,
	getScrollListProductsService,
	getExploreProductsService,
	getWishListService,
};
