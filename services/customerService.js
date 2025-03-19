const Customers = require("../models/customers");
const bcrypt = require("bcryptjs");

// Update customer account details
const putAccountsDetailsService = async (id, data) => {
	try {
		const customer = await Customers.findByPk(id);
		if (!customer) {
			return { success: false, error: "Customer not found." };
		}

		// Validate Gmail format
		const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
		if (data.email && !gmailRegex.test(data.email)) {
			return { success: false, error: "Invalid email address." };
		}

		// Ensure both password and confirm password are provided
		if (data.password && data.conPassword) {
			if (data.password !== data.conPassword) {
				return { success: false, error: "Passwords do not match." };
			}
			// Hash password before saving
			data.password = await bcrypt.hash(data.password, 10);
		}

		// Update only provided fields
		const accountUpdateDetails = [
			"firstName",
			"lastName",
			"email",
			"conPassword",
		];
		accountUpdateDetails.forEach((key) => {
			if (data[key] !== undefined) {
				customer[key] = data[key];
			}
		});

		await customer.save();
		return { success: true, customer };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Update customer billing info
const putBillingInfoService = async (id, data) => {
	try {
		// Find the customer by ID
		const customer = await Customers.findByPk(id);
		if (!customer) {
			return { success: false, error: "Customer not found." };
		}

		// Update only billing-related fields
		const billingFields = ["streetAddress", "apartment", "town", "phoneNumber"];
		billingFields.forEach((field) => {
			if (data[field] !== undefined) {
				customer[field] = data[field];
			}
		});

		await customer.save();
		return { success: true, customer };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

module.exports = {
	putAccountsDetailsService,
	putBillingInfoService,
};
