const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialetOptions: !process.env.DATABASE_URL.includes('localhost') ? {
    ssl:{
        require: true,
        rejectedUnauthorized: false,
        //process.env.ENVIRONMENT === "production"
    }
} : {} 
});

module.exports = sequelize;