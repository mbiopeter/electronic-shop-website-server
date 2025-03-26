const express = require('express');
const router = express.Router();
const { createOrderController, getOrderController, allOrdersController, cancelledOrderController } = require('../controllers/orderController');

router.post('/new', createOrderController);
router.get('/one', getOrderController);
router.get('/all', allOrdersController);
router.get('/cancelled', cancelledOrderController);

module.exports = router;
