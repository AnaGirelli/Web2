module.exports = (sequelize, Sequelize) => {
    const Produto = sequelize.define('produto', {
        id_produto: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        id_vendedor: {
            type: Sequelize.INTEGER, allowNull: true
        },
        id_categoria: {
            type: Sequelize.INTEGER, allowNull: true
        },
        nome_produto: {
            type: Sequelize.STRING(255), allowNull: true
        },
        preco: {
            type: Sequelize.DECIMAL(10, 2), allowNull: true
        },
        id_unidade_medida: {
            type: Sequelize.INTEGER, allowNull: true
        },
        ativo: {
            type: Sequelize.BOOLEAN, allowNull: true
        },
        url_imagem: {
            type: Sequelize.STRING(255), allowNull: true
        },
        estoque: {
            type: Sequelize.DECIMAL(10, 3), allowNull: true, defaultValue: 0.000
        }
    });

    return Produto;
}