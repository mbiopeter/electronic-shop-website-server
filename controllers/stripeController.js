const { createCheckoutSession, retrieveCheckoutSession } = require('../services/stripeServices');
const nodemailer = require('nodemailer');

// Checkout process
const checkout = async (req, res) => {
    const { cartItems, email } = req.body;
    try {
        const sessionUrl = await createCheckoutSession(cartItems, email);
        res.status(200).json({ url: sessionUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// After successful payment, redirect user and send email
const completePayment = async (req, res) => {
    const { session_id, email } = req.query;

    try {
        const session = await retrieveCheckoutSession(session_id);

        // Send an email to the user with the purchase details
        const senderEmail = process.env.EMAIL_USER;
        const subject = 'Thank You for Your Purchase!';
        const message = `
            Dear ${email},<br><br>
            Thank you for your purchase! We have received your payment and your order is being processed.<br><br>
            Order details:<br>
            <strong>Order ID:</strong> ${session.id}<br>
            <strong>Total:</strong> KES ${(session.amount_total / 100).toFixed(2)}<br><br>
            You can follow the shipping process on our website <a href="${process.env.CLIENT_HOME_URL}/orders" target="_blank">active order</a>.<br><br>
            If you have any questions, feel free to reach out to us.<br><br>
            Best regards,<br>
            Shoppers Team
        `;

        await sendEmail(senderEmail, email, subject, message);
        res.redirect(process.env.CLIENT_HOME_URL);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle payment cancellation
const cancelPayment = (req, res) => {
    res.status(203).json({ cancelled: true });
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
