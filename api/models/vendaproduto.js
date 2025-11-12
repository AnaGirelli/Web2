module.exports = (sequelize, Sequelize) => {
    const Produto = sequelize.define('produto', {
        id_venda_produto: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        id_venda: {
            type: Sequelize.INTEGER, allowNull: true
        },
        id_produto: {
            type: Sequelize.INTEGER, allowNull: true
        },
        quantidade: {
            type: Sequelize.DECIMAL(10, 2), allowNull: true
        },
        preco_unitario: {
            type: Sequelize.DECIMAL(10, 2), allowNull: true
        }
    });

    return VendaProduto;
}