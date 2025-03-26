const { mpesaCallbackService } = require("../services/mpesaCallbackService");

const mpesaCallbackController = async (req, res) => {
	try {
		await mpesaCallbackService(req, res);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Callback processing failed", error: error.message });
	}
};

module.exports = {
	mpesaCallbackController,
};
