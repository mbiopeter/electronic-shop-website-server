const {
    getSliderService,
    getBannerService
} = require('../services/sliderService');

const getSliderController = async (req, res) => {
    try {
        const response = await getSliderService();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const getBannerController = async (req, res) => {
    try {
        const response = await getBannerService();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).jon(error.message)
    }
}

module.exports = {
    getSliderController,
    getBannerController
}