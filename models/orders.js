const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Orders = sequelize.define('Orders', {
    orderPlaced: {
        type: DataTypes.DATE,
        allowNull: true
    },
    paymentAccepted: {
        type: DataTypes.DATE,
        allowNull: true
    },
    deliveryReady: {
        type: DataTypes.DATE,
        allowNull: true
    },
    delivered: {
        type: DataTypes.DATE,
        allowNull: true
    },
    received: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    timestamps: true,
});

module.exports = Orders;
