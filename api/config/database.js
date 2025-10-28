//Arquivo de configuração do banco de dados

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('verdear', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;