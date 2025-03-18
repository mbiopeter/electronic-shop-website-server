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
            image: post.image,
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
        // Fetch 5 random posters from the database using Sequelize
        const sliderPost = await Poster.findAll({
            order: Sequelize.literal('RAND()'),
            limit: 1
        });

        // Format the returned data as requested
        const formattedSliderPosts = sliderPost.map(post => ({
            id: post.id,
            image: post.image,
            name: post.name,
            description: post.description,
            title: post.title,
            discount: `Up to ${post.discount}% off Voucher`,
            buttonText: post.btn
        }));

        return formattedSliderPosts;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getSliderService,
    getBannerService
}

