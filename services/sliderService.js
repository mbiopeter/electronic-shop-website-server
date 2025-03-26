const Poster = require('../models/poster');
const Sequelize = require('sequelize');

const getSliderService = async () => {
    try {
        // Fetch 5 random posters from the database using Sequelize
        const sliderPost = await Poster.findAll({
            order: Sequelize.literal('RAND()'),
            limit: 5
        });

        // Format the returned data as requested
        const formattedSliderPosts = sliderPost.map(post => ({
            id: post.id,
            image: `http://localhost:4000/${post.img}`,
            title: post.title,
            discount: `Up to ${post.discount}% off Voucher`,
            buttonText: post.btn
        }));

        return formattedSliderPosts;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getBannerService = async () => {
    try {
        const sliderPost = await Poster.findOne({
            order: Sequelize.literal('RAND()')
        });

        if (!sliderPost) {
            return null;
        }
        return {
            id: sliderPost.id,
            image: `http://localhost:4000/${sliderPost.img}`,
            name: sliderPost.name,
            description: sliderPost.description,
            title: sliderPost.title,
            discount: `Up to ${sliderPost.discount}% off Voucher`,
            buttonText: sliderPost.btn
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getSliderService,
    getBannerService
}

