const {
	putAccountsDetailsService,
	updateBillingInfoService,
	getCustomersService,
} = require("../services/customerService");

const putAccountsDetailsController = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		console.log(updateData);

		const response = await putAccountsDetailsService(id, updateData);
		if (!response.success) {
			return res.status(400).json({ success: false, error: response.error });
		}

		res.status(200).json({ success: true, customer: response.customer });
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const updateBillingInfoController = async (req, res) => {
	try {
		const {
			userId,
			firstName,
			streetAdress,
			apartment,
			town,
			phoneNumber,
		} = req.body;


		await updateBillingInfoService(
			userId,
			firstName,
			streetAdress,
			apartment,
			town,
			phoneNumber,
		);
		res.json({ message: "Billing information updated successfully" });
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getCustomersController = async (req, res) => {
	try {
		const { userId } = req.query;
		const response = await getCustomersService(userId);
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

module.exports = {
	putAccountsDetailsController,
	updateBillingInfoController,
	getCustomersController,
};
