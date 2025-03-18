const express = require('express');
const {
    addCartController,
    deleteCartController,
    getCartController
} = require('../controllers/cart');

const router = express.Router();

router.post('/new', addCartController);
router.delete('/remove', deleteCartController);
router.get('/all', getCartController);

module.exports = router;
