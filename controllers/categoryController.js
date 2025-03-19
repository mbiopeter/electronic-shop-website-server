const {
	getBasicCategoryService,
	getOtherCategoryService,
} = require("../services/categoryService");

const getBasicCategoryController = async (req, res) => {
	try {
		const response = await getBasicCategoryService();
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getOtherCategoryController = async (req, res) => {
	try {
		const response = await getOtherCategoryService();
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

module.exports = {
	getBasicCategoryController,
	getOtherCategoryController,
};
