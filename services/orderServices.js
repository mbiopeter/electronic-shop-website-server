const Cart = require("../models/cart");
const { format } = require('date-fns');
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

const getOrderService = async (userId) => {
    try {
        const orders = await Orders.findAll({ where: { userId } });
        if (!orders) {
            throw new Error('Order not found');
        }

        return orders.map(formatOrderDates); 
    } catch (error) {
        throw new Error(error.message);
    }
};

const formatOrderDates = (order) => {
    const dateFields = ['pending', 'processed', 'shipped', 'delivered', 'cancelled', 'returned'];
    let formattedOrder = { ...order.get({ plain: true }) };

    dateFields.forEach(field => {
        if (formattedOrder[field]) {
            formattedOrder[field] = format(new Date(formattedOrder[field]), 'dd MMMM yyyy hh:mm a');
        }
    });

    return {
        id: formattedOrder.id,
        productId: JSON.parse(formattedOrder.productId || '[]'),
        userId: formattedOrder.userId,
        status: formattedOrder.status,
        payment: formattedOrder.payment,
        paymentCode: formattedOrder.paymentCode,
        pending: formattedOrder.pending,
        processed: formattedOrder.processed,
        shipped: formattedOrder.shipped,
        delivered: formattedOrder.delivered,
        waitingDelivery: formattedOrder.waitingDelivery,
        cancelled: formattedOrder.cancelled,
        returned: formattedOrder.returned,
        createdAt: format(new Date(formattedOrder.createdAt), 'dd MMMM yyyy hh:mm a'),
        updatedAt: format(new Date(formattedOrder.updatedAt), 'dd MMMM yyyy hh:mm a')
    };
};

module.exports = {
    createOrderService,
    deletecartStripeService,
    getOrderService
}