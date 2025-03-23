const Cart = require("../models/cart");
const Orders = require("../models/orders");

const createOrderService = async (productIds, userId, payment, paymentCode) => {
    try {
        console.log('order function successfully!');
        if (!productIds || !userId || !payment) {
            console.log("All details are required!");
            throw new Error("All details are required!");
        }
        const createOrder = await Orders.create({
            productId: productIds,
            userId,
            payment,
            paymentCode,
        });
        console.log('order created successfully!');
        return createOrder;
    } catch (error) {
        throw new Error(error);
    }
}
const deletecartStripeService = async (productIds, userId) => {
    try {
        console.log('delete cart function successfully!');
        for (let i = 0; i < productIds.length; i++) {
            await Cart.destroy({ where: { userId, productId: productIds[i] } })
        }
        console.log('delete cart successfully!');
        return true
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    createOrderService,
    deletecartStripeService
}