module.exports = (sequelize, Sequelize) => {
    const FormaPagamento = sequelize.define('forma_pagamento', {
        id_forma_pagamento: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        descricao: {
            type: Sequelize.STRING(255), allowNull: true
        }
    });

    return FormaPagamento;
}