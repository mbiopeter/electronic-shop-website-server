const express = require('express');
const {
    getBasicCategoryController,
    getOtherCategoryController
} = require('../controllers/categoryController');

const router = express.Router();

router.get('/basic', getBasicCategoryController);
router.get('/others', getOtherCategoryController);

module.exports = router;
