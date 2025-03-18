const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const History = sequelize.define('History', {
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

module.exports = History;
