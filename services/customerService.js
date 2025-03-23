const Customers = require("../models/customers");
const bcrypt = require("bcryptjs");

const getCustomersService = async (userId) => {
	try {
		if (!userId) {
			throw new Error("user id is required");
		}
		const customers = await Customers.findOne({ where: { id: userId }, attributes: ['email', 'firstName', 'lastName', 'streetAddress', 'apartment', 'town', 'phoneNumber'] });
		return customers;
	} catch (error) {
		throw new Error(error.message);
	}
};

// Update customer account details
const putAccountsDetailsService = async (id, data) => {
	try {
		const customer = await Customers.findByPk(id);
		if (!customer) {
			return { success: false, error: "Customer not found." };
		}

		const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
		if (data.email && !gmailRegex.test(data.email)) {
			return { success: false, error: "Invalid email address." };
		}

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

const updateBillingInfoService = async (
	userId,
	firstName,
	streetAdress,
	apartment,
	town,
	phoneNumber
) => {
	try {
		if (!firstName || !streetAdress || !town || !phoneNumber || !email) {
			throw new Error('Ensure all the required fileds are not empty')
		}
		const updateDetails = await Customers.update({ firstName, streetAdress, apartment, town, phoneNumber }, { where: { id: userId } });
		return updateDetails;
	} catch (error) {
		return { success: false, error: error.message };
	}
};

module.exports = {
	putAccountsDetailsService,
	updateBillingInfoService,
	getCustomersService,
};
