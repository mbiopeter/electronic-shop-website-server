const express = require('express');
const router = express.Router();
const { createOrderController, getOrderController } = require('../controllers/orderController');

router.post('/new', createOrderController);
router.get('/one', getOrderController);

module.exports = router;
