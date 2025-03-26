const express = require('express');
const router = express.Router();
const { checkout, completePayment, cancelPayment } = require('../controllers/stripeController');

router.post('/checkout', checkout);

router.get('/complete', completePayment);

router.get('/cancel', cancelPayment);

module.exports = router;
