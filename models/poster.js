const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Poster = sequelize.define('Poster', {
    name: {
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

module.exports = Poster;
