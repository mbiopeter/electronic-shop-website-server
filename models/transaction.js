const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); 

const Transaction = sequelize.define("Transaction", {
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	phoneNumber: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	amount: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	Status: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "Pending",
	},
});

module.exports = Transaction;
