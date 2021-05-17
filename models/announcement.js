const {DataTypes} = require("sequelize");
const db = require("../db");

const Announcement = db.define("announcement", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    response: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
});

module.exports = Announcement;