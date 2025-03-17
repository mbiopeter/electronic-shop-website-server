const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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

Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Cart.belongsTo(models.Product, { foreignKey: 'productId', onDelete: 'CASCADE' });
};

module.exports = Cart;
