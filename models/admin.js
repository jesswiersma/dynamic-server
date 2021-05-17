const {DataTypes} = require("sequelize");
const db = require("../db");

const Admin = db.define("admin", {
    firstName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    organization: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Admin;