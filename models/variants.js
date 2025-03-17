const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Variants = sequelize.define('Variants', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    variantType: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
});

module.exports = Variants;
