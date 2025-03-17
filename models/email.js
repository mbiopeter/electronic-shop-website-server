const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Email = sequelize.define('Emails', {
    from: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    cc: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    }
}, {
    timestamps: true,
});

module.exports = Email;
