const Sequelize = require('sequelize');
const sequelize = new Sequelize('expenses','root','1234',
    {
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;