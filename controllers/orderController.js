const {
    createOrderService,
    deletecartStripeService
} = require('../services/orderServices');

const createOrderController = async (req, res) => {
    try {
        const { cartItems, userId } = req.body;

        const payment = 'cash';
        productIds = [];

        cartItems.map((item) => {
            productIds.push(item.productId);
        })

        const deleteCart = await deletecartStripeService(productIds, userId);
        if (deleteCart) {
            await createOrderService(productIds, userId, payment);
            return res.status(200).json({ message: true })
        }
    } catch (error) {
        res.status(500).json(res.message);
    }
}

module.exports = { createOrderController }