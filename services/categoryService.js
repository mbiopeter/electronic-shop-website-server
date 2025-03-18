const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const { Op } = require('sequelize');

const getBasicCategoryService = async () => {
    try {
        const categories = await Category.findAll({
            limit: 7
        });

        const categoryData = await Promise.all(categories.map(async (category) => {
            const subcategories = await SubCategory.findAll({
                where: { category: category.name }
            });

            const subcategoryDetails = subcategories.map(subcategory => {
                const subcategoryNameLink = subcategory.name
                    .toLowerCase()
                    .replace(/ /g, '-')
                    .replace(/'/g, '');

                const imgUrl = `http://localhost:4000/${subcategory.img}`;

                return {
                    name: subcategory.name,
                    img: imgUrl,
                    link: `/category/${category.id.toString()}/${subcategoryNameLink}`
                };
            });

            return {
                id: category.id,
                img: `http://localhost:4000/${category.img}`,
                name: category.name,
                link: `/category/${category.id.toString()}`,
                subcategories: subcategoryDetails
            };
        }));

        return categoryData;

    } catch (error) {
        throw new Error(error.message);
    }
};

const getOtherCategoryService = async () => {
    try {
        // Fetch all categories excluding the "Fast 7"
        const categories = await Category.findAll({
            where: {
                name: { [Op.ne]: 'Fast 7' }
            }
        });

        // If there are 7 or fewer categories, return an empty array
        if (categories.length <= 7) {
            return [];
        }

        // Otherwise, fetch the categories excluding the first 7
        const remainingCategories = categories.slice(7);

        const categoryData = await Promise.all(remainingCategories.map(async (category) => {
            const subcategories = await SubCategory.findAll({
                where: { category: category.name }
            });

            const subcategoryDetails = subcategories.map(subcategory => {
                const subcategoryNameLink = subcategory.name
                    .toLowerCase()
                    .replace(/ /g, '-')
                    .replace(/'/g, '');

                const imgUrl = `http://localhost:4000/${subcategory.img}`;

                return {
                    name: subcategory.name,
                    img: imgUrl,
                    link: `/category/${category.id.toString()}/${subcategoryNameLink}`
                };
            });

            return {
                id: category.id,
                img: `http://localhost:4000/${category.img}`,
                name: category.name,
                link: `/category/${category.id.toString()}`,
                subcategories: subcategoryDetails
            };
        }));

        return categoryData;

    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getBasicCategoryService,
    getOtherCategoryService
};
