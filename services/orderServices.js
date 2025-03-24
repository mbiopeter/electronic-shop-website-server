const Cart = require("../models/cart");
const Orders = require("../models/orders");

const createOrderService = async (productIds, userId, payment, paymentCode) => {
    try {

        if (!productIds || !userId || !payment) {
            throw new Error("All details are required!");
        }
        const createOrder = await Orders.create({
            productId: productIds,
            userId,
            payment,
            paymentCode,
        });

        return createOrder;
    } catch (error) {
        throw new Error(error);
    }
}
const deletecartStripeService = async (productIds, userId) => {
    try {

        for (let i = 0; i < productIds.length; i++) {
            await Cart.destroy({ where: { userId, productId: productIds[i] } })
        }

        return true
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    createOrderService,
    deletecartStripeService
}