module.exports = (sequelize, Sequelize) => {
    const Pessoa = sequelize.define('pessoa', {
        id_pessoa: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        nome_pessoa: {
            type: Sequelize.STRING(255), allowNull: true
        },
        cpf: {
            type: Sequelize.STRING(11), allowNull: true
        },
        email: {
            type: Sequelize.STRING(100), allowNull: true
        },
        senha: {
            type: Sequelize.STRING(50), allowNull: true
        },
        endereco: {
            type: Sequelize.STRING(255), allowNull: true
        },
        id_bairro: {
            type: Sequelize.INTEGER, allowNull: true
        },
        telefone: {
            type: Sequelize.STRING(20), allowNull: true
        },
        tipo_usuario: {
            type: Sequelize.STRING(20), allowNull: true, defaultValue: 0.000
        },
        ativo: {
            type: Sequelize.BOOLEAN, allowNull: true
        }
    });

    return Pessoa;
}