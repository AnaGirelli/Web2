export default (sequelize, Sequelize) => {
    return sequelize.define('formapagamento', {
        id_forma_pagamento: {
            type: Sequelize.INTEGER,
            autoIncrement: true, 
            allowNull: false, 
            primaryKey: true
        },
        descricao: {
            type: Sequelize.STRING(255), 
            allowNull: true
        }
    }, {
        tableName: 'formapagamento', // Força o Sequelize a usar EXATAMENTE 'formapagamento'
        freezeTableName: true, // Garante que o nome não será pluralizado
        timestamps: false // Desativa os campos automáticos de timestamp
    });
};