const axios = require("axios");
require("dotenv").config();

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

const stkPushService = async (req, res, response) => {
	try {
		if (!req.body || !req.body.phoneNumber) {
			return res.status(400).json({ message: "Phone number is required" });
		}

		const token = await createTokenService();

		const shortCode = 174379;
		const phone = req.body.phoneNumber.substring(1);
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
			Amount: req.body.amount || 1,
			PartyA: `254${phone}`,
			PartyB: 174379,
			PhoneNumber: `254${phone}`,
			CallBackURL: "https://myservercall.loca.lt/payment_with_mpesa/callback",
			AccountReference: "Mpesa Test",
			TransactionDesc: "Testing stk push",
		};

		const response = await axios.post(
			"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
			requestData,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		return res.status(200).json(response.data);
	} catch (error) {
		console.error("STK Push Error:", error.message);
		return res
			.status(500)
			.json({ message: "STK Push failed", error: error.message });
	}
};

module.exports = { createTokenService, stkPushService };
