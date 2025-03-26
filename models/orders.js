const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Orders = sequelize.define('Orders', {
    productId: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
    },
    processed: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    shipped: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    delivered: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    waitingDelivery: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    cancelled: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    returned: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    payment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentCode: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
});

module.exports = Orders;
