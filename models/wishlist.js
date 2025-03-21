const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Wishlist = sequelize.define(
	"Wishlist",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			onDelete: "CASCADE",
		},
		productId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			onDelete: "CASCADE",
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = Wishlist;
