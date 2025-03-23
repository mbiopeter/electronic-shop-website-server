const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (cartItems, email, userId) => {
    try {
        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'kes',
                product_data: {
                    name: item.product,
                    images: [item.img],
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        const productIds = [];

        cartItems.map((item) => {
            productIds.push(item.productId);
        });

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/stripe/complete?session_id={CHECKOUT_SESSION_ID}&email=${email}&userId=${userId}&productIds=${JSON.stringify(productIds)}`,
            cancel_url: `${process.env.BASE_URL}/stripe/cancel`,
            customer_email: email,
            billing_address_collection: 'required',
            shipping_address_collection: { allowed_countries: ['KE'] },
        });

        return session.url;

    } catch (error) {
        throw new Error(error.message);
    }
};

// Retrieve session data from Stripe
const retrieveCheckoutSession = async (sessionId) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent.payment_method'] });
        return session;
    } catch (error) {
        throw new Error(`Error retrieving Stripe session: ${error.message}`);
    }
};

module.exports = {
    createCheckoutSession,
    retrieveCheckoutSession,
};
