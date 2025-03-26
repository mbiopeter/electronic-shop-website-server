const {
	putAccountsDetailsService,
	putBillingInfoService,
	getCustomerService,
} = require("../services/customerService");

const putAccountsDetailsController = async (req, res) => {
	try {
		const { id } = req.params; // Extract customer ID from URL
		const updateData = req.body; // Get request body data
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

const putBillingInfoController = async (req, res) => {
	try {
		const { id } = req.params; // Extract customer ID from URL
		const updateData = req.body; // Get request body data

		const response = await putBillingInfoService(id, updateData);
		if (!response.success) {
			return res.status(400).json({ success: false, error: response.error });
		}

		res.json({ success: true, customer: response.customer });
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getCustomerController = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await getCustomerService(id);
		if (!response.success) {
			return res.status(400).json({ success: false, error: response.error });
		}

		res.status(200).json(response);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

module.exports = {
	putAccountsDetailsController,
	putBillingInfoController,
	getCustomerController,
};
