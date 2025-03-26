const {
	createTokenService,
	stkPushService,
} = require("../services/mpesaPaymentService");

const createTokenController = async (req, res) => {
	try {
		const token = await createTokenService();
		res.status(200).json({ access_token: token });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Token generation failed", error: error.message });
	}
};

const stkPushController = async (req, res) => {
	try {
		await stkPushService(req, res);
	} catch (error) {
		res.status(500).json({ message: "STK Push failed", error: error.message });
	}
};

module.exports = {
	createTokenController,
	stkPushController,
};
