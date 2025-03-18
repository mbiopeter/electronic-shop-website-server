const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require("./products");
const Customer = require("./customers");

const Cart = sequelize.define('Cart', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
});

Cart.associate = () => {
    Cart.belongsTo(Customer, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Cart.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });
};

module.exports = Cart;
