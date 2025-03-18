const express = require('express');
const {
    getSliderController,
    getBannerController
} = require('../controllers/sliderController');

const router = express.Router();
router.get('', getSliderController);
router.get('/banner', getBannerController);

module.exports = router;
