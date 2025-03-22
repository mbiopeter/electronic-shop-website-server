const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rating = sequelize.define(
    "Rating",
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        updatedAt: "updatedAt",
        createdAt: "createdAt",
    }
);

module.exports = Rating;
