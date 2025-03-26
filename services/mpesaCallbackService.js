const Transaction = require("../models/transaction"); // Import the model

const mpesaCallbackService = async (req, res) => {
	try {
		console.log("M-Pesa Callback Response:", JSON.stringify(req.body, null, 2));

		const { Body } = req.body;
		if (!Body || !Body.stkCallback) {
			return res.status(400).json({ message: "Invalid callback data" });
		}

		const {
			MerchantRequestID,
			CheckoutRequestID,
			ResultCode,
			ResultDesc,
			CallbackMetadata,
		} = Body.stkCallback;

		let status = ResultCode === 0 ? "Success" : "Failed";

		// Extract transaction details if successful
		let transactionData = {
			MerchantRequestID,
			CheckoutRequestID,
			ResultCode,
			ResultDesc,
			Status: status, // "Success" or "Failed"
		};

		if (ResultCode === 0 && CallbackMetadata?.Item) {
			CallbackMetadata.Item.forEach((item) => {
				transactionData[item.Name] = item.Value;
			});
		}

		// Save transaction to the database
		await Transaction.create(transactionData);

		console.log(`Transaction ${status}:`, transactionData);

		// Respond to Safaricom
		res
			.status(200)
			.json({ message: "Callback received and transaction saved" });

		console.log("Transaction Data:", transactionData);

		return transactionData;
	} catch (error) {
		console.error("Callback Processing Error:", error.message);
		res.status(500).json({ message: "Callback processing failed" });
	}
};

module.exports = { mpesaCallbackService };
