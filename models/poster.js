const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Poster = sequelize.define('Poster', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    discount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    btn: {
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
