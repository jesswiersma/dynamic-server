const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize("postgres://postgres:Elevenfifty@localhost:5432/dynamic-server");

module.exports = sequelize;