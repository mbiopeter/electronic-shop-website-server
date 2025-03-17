const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sequelize instance

const CountDown = sequelize.define('CountDown', {
    day: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    seconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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

module.exports = CountDown;
