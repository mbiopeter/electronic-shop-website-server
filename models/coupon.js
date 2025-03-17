const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    discountType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    discountAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    minimumAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    expiry: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Active',
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'Coupon',
});

module.exports = Coupon;
