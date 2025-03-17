const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VariantType = sequelize.define('VariantType', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
});

module.exports = VariantType;
