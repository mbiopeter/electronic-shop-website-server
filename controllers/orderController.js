const {
    createOrderService,
    deletecartStripeService,
    getOrderService
} = require('../services/orderServices');
const nodemailer = require('nodemailer');


const createOrderController = async (req, res) => {
    try {
        const { cartItems, userId, email } = req.body;
        const payment = 'Cash on Delivery';
        let productIds = [];
        let productDetails = [];
        let totalAmount = 0;

        console.log(cartItems)

        cartItems.forEach((item) => {
            const productId = item?.productId?.id || 'Unknown ID';
            const quantity = item?.productId?.quantity || 0;
            const name = item?.name || 'Unnamed Product';
            const price = Number(item?.price) || 0;

            productIds.push(productId);
            productDetails.push({ id: productId, quantity });
            totalAmount += price * quantity;
        }); 

        const deleteCart = await deletecartStripeService(productIds, userId);
        if (deleteCart) {
            await createOrderService(productDetails, userId, payment);

            const senderEmail = process.env.EMAIL_USER;
            const subject = 'Thank You for Your Order!';

            let tableRows = '';
            cartItems.forEach((product, index) => {
                const name = product?.name || 'Unnamed Product';
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
                <p>Thank you for your order. Your order is currently being processed.</p>
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
                <p>You can track your order <a href="${process.env.CLIENT_HOME_URL}/orders" target="_blank">here</a>.</p>
                <p>If you have any questions, feel free to reach out to us.</p>
                <p>Best regards,<br>Shoppers Team</p>
            `;

            await sendEmail(senderEmail, email, subject, message);
            return res.status(200).json({ message: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


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

const getOrderController = async (req, res) => {
    try {
        const { orderId } = req.query;
        const response = await getOrderService(orderId);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrderController,
    getOrderController
}