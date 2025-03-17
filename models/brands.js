const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Brands = sequelize.define('Brands', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    SubCategory: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
});

module.exports = Brands;
