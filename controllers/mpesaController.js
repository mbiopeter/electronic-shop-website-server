const {
	stkPushService,
} = require("../services/mpesaService");
const { mpesaCallbackService } = require("../services/mpesaService");

const stkPushController = async (req, res) => {
	try {
		const { userId, email, phoneNumber, cartItems } = req.body;
		let totalAmount = 0;


		cartItems.forEach((item) => {
			const quantity = item?.productId?.quantity || 0;
			const price = Number(item?.price) || 0;

			totalAmount += price * quantity;
		});

		await stkPushService(userId, email, phoneNumber, cartItems, totalAmount);
		res.status(200).json({ message: "mpesa stk push sent to your phone, please enter mpesa pin to confirm payment" });
	} catch (error) {
		res.status(500).json({ message: "STK Push failed", error: error.message });
	}
};

const mpesaCallbackController = async (req, res) => {
	try {
		console.log(req.body)
		const response = await mpesaCallbackService(req, res);
		console.log(response);
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	mpesaCallbackController,
	stkPushController
};