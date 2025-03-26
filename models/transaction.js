const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); 

const Transaction = sequelize.define("Transaction", {
	MerchantRequestID: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	CheckoutRequestID: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	ResultCode: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	ResultDesc: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	MpesaReceiptNumber: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	Amount: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	PhoneNumber: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	TransactionDate: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	Status: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "Pending", // Default before processing
	},
});

module.exports = Transaction;
