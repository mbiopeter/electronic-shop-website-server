const axios = require("axios");
require("dotenv").config();
const Transaction = require("../models/transaction");
const Product = require("../models/products");
const Cart = require("../models/cart");
const { createOrderService } = require("./orderServices");
const Customer = require("../models/customers");
const nodemailer = require('nodemailer');

// Store token to prevent redundant requests
let cachedToken = null;
let tokenExpiry = null;

const createTokenService = async () => {
	try {
		// Use cached token if valid
		if (cachedToken && tokenExpiry > Date.now()) {
			return cachedToken;
		}

		const consumerKey = process.env.CONSUMER_KEY;
		const consumerSecret = process.env.CONSUMER_SECRET;
		const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
			"base64"
		);

		const response = await axios.get(
			"https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
			{ headers: { Authorization: `Basic ${auth}` } }
		);

		cachedToken = response.data.access_token;
		tokenExpiry = Date.now() + 3400000; // Token expires in ~1 hour

		return cachedToken;
	} catch (error) {
		console.error("Token Generation Error:", error.message);
		throw new Error("Failed to generate token");
	}
};


const stkPushService = async (userId, email, phoneNumber, cartItems, totalAmount) => {
	try {
		if (!phoneNumber) {
			throw new Error("Phone number is required");
		}

		const token = await createTokenService();

		const amount = 1;
		const shortCode = 174379;
		const phone = phoneNumber.substring(1);
		const passkey =
			"bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
		const timestamp = new Date()
			.toISOString()
			.replace(/[-T:Z.]/g, "")
			.substring(0, 14);

		const password = Buffer.from(shortCode + passkey + timestamp).toString(
			"base64"
		);

		const requestData = {
			BusinessShortCode: shortCode,
			Password: password,
			Timestamp: timestamp,
			TransactionType: "CustomerPayBillOnline",
			Amount: amount,
			PartyA: `254${phone}`,
			PartyB: 174379,
			PhoneNumber: `254${phone}`,
			CallBackURL: "https://education-tom-angry-petite.trycloudflare.com/mpesa/callback",
			AccountReference: "Mpesa Test",
			TransactionDesc: "Testing stk push",
		};

		await axios.post(
			"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
			requestData,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		//check if the transaction exists
		const count = await Transaction.findAll({
			where: {
				userId,
				phoneNumber: `254${phone}`,
				amount,
				status: "Pending"
			}
		});
		if (count.length < 1) {
			//create a transaction tracking details
			const response = await Transaction.create({
				userId,
				phoneNumber: `254${phone}`,
				amount,
			});
			return response.data;
		}
		return count.data;
	} catch (error) {
		console.error("STK Push Error:", error);
		return res
			.status(500)
			.json({ message: "STK Push failed", error: error.message });
	}
};


const mpesaCallbackService = async (req, res) => {
	try {
		console.log("M-Pesa Callback Response:", JSON.stringify(req.body, null, 2));

		const { Body } = req.body;
		if (!Body || !Body.stkCallback) {
			throw new Error("Invalid Callback Data");
		}

		const { stkCallback } = Body;
		const { ResultCode, CallbackMetadata } = stkCallback;

		if (ResultCode !== 0) {
			console.log("Transaction Failed:", stkCallback);
			throw new Error("Transaction Failed", ResultCode);
		}

		const metadataItems = CallbackMetadata?.Item || [];
		const transactionData = {};

		metadataItems.forEach((item) => {
			transactionData[item.Name] = item.Value;
		});

		const phoneNumber = transactionData.PhoneNumber || null;
		const mpesaReceiptNumber = transactionData.MpesaReceiptNumber || null;
		const amount = transactionData.Amount || null;

		if (!phoneNumber || !mpesaReceiptNumber || !amount) {
			throw new Error("Missing transaction details");
		}
		const transaction = await Transaction.findOne({
			where: { phoneNumber, amount, status: "Pending" },
		});

		if (!transaction) {
			throw new Error("Transaction not found");

		}
		const userId = transaction.userId;
		await Transaction.destroy({ where: { userId } });


		const cartItems = await Cart.findAll({ where: { userId } });
		if (!cartItems.length) {
			throw new Error("No items found in cart");
		}

		let productDetails = [];
		let cartItemsArray = [];
		let totalAmount = 0;

		for (const item of cartItems) {
			const product = await Product.findOne({ where: { id: item.productId } });
			if (!product) continue;

			productDetails.push({ id: product.id, quantity: item.quantity });
			const total = product.offerPrice * item.quantity;
			totalAmount += total;

			cartItemsArray.push({
				product: product.name,
				price: product.offerPrice,
				quantity: item.quantity,
				total,
			});
		}
		console.log("peter");
		console.log(cartItemsArray);
		await Cart.destroy({ where: { userId } });

		const paymentMethod = "M-Pesa";
		await createOrderService(productDetails, userId, paymentMethod, mpesaReceiptNumber);

		const user = await Customer.findOne({ where: { id: userId } });
		const email = user?.email || "";

		const senderEmail = process.env.EMAIL_USER;
		const subject = "Thank You for Your Purchase!";

		let tableRows = '';
		cartItemsArray.forEach((product, index) => {
			tableRows += `
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${product.product}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">KES ${product.price}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${product.quantity}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">KES ${product.total}</td>
                </tr>`;
		});

		const message = `
            <p>Dear ${email},</p>
            <p>Thank you for your purchase through mpesa! We have received your payment, and your order is being processed.</p>
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
            <p><strong>Confirmation Code:</strong>${mpesaReceiptNumber}</p>
            <p><strong>Grand Total:</strong> KES ${totalAmount}</p>
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>Best regards,<br>Shoppers Team</p>
        `;

		await sendEmail(senderEmail, email, subject, message);

		return {
			message: "Transaction Successful",
			mpesaReceiptNumber,
			amount,
			products: cartItemsArray,
		};
	} catch (error) {
		throw new Error(error.message);
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

module.exports = { createTokenService, stkPushService, mpesaCallbackService };
