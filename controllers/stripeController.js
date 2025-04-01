const { createCheckoutSession, retrieveCheckoutSession } = require('../services/stripeServices');
const { createOrderService, deletecartStripeService } = require('../services/orderServices');
const nodemailer = require('nodemailer');

// Checkout process
const checkout = async (req, res) => {
    const { cartItems, email, userId } = req.body;
    try {
        const sessionUrl = await createCheckoutSession(cartItems, email, userId);
        res.status(200).json({ url: sessionUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// After successful payment, redirect user and send email
const completePayment = async (req, res) => {
    try {
        const { session_id, email, userId, cartItems } = req.query;
        const paymentMethod = 'Bank Payment';
        const cartItemsArray = JSON.parse(decodeURIComponent(cartItems));

        let productIds = [];
        let productDetails = [];
        let totalAmount = 0;

        cartItemsArray.forEach((item) => {
            const productId = item?.productId?.id || 'Unknown ID';
            const quantity = item?.productId?.quantity || 0;
            const name = item?.product || 'Unnamed Product';
            const price = Number(item?.price) || 0;

            productIds.push(productId);
            productDetails.push({ id: productId, quantity });
            totalAmount += price * quantity;
        });

        const session = await retrieveCheckoutSession(session_id);
        const deleteCart = await deletecartStripeService(productIds, userId);

        if (deleteCart) {
            await createOrderService(productDetails, userId, paymentMethod);

            const senderEmail = process.env.EMAIL_USER;
            const subject = 'Thank You for Your Purchase!';

            let tableRows = '';
            cartItemsArray.forEach((product, index) => {
                const name = product?.product || 'Unnamed Product';
                const price = Number(product?.price) || 0;
                const quantity = product?.productId?.quantity || 0;
                const total = price * quantity;

                tableRows += `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">KES ${price.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${quantity}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">KES ${total.toFixed(2)}</td>
                    </tr>`;
            });

            const message = `
                <p>Dear ${email},</p>
                <p>Thank you for your purchase through bank! We have received your payment, and your order is being processed.</p>
                <p><strong>Order Details:</strong></p>
                <table style="border-collapse: collapse; width: 100%; text-align: left; font-family: Arial, sans-serif;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 8px; border: 1px solid #ddd;">#</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <p><strong>Grand Total:</strong> KES ${totalAmount.toFixed(2)}</p>
                <p>If you have any questions, feel free to reach out to us.</p>
                <p>Best regards,<br>Shoppers Team</p>
            `;

            await sendEmail(senderEmail, email, subject, message);
            return res.redirect(process.env.CLIENT_HOME_URL);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Handle payment cancellation
const cancelPayment = (req, res) => {
    res.redirect(`${process.env.CLIENT_HOME_URL}/cart`);
};

// Send email helper function
const sendEmail = async (from, to, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `no-reply@${from}`,
            to,
            subject,
            text: body,
            html: `<h3>${subject}</h3><p>${body}</p>`,
            replyTo: `no-reply@${from}`,
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        throw new Error(`Failed to send email: ${err.message}`);
    }
};

module.exports = {
    checkout,
    completePayment,
    cancelPayment,
};
