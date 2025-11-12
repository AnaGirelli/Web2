module.exports = (sequelize, Sequelize) => {
    const Venda = sequelize.define('venda', {
        id_venda: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        id_cliente: {
            type: Sequelize.INTEGER, allowNull: true
        },
        data_venda: {
            type: Sequelize.DATE, allowNull: true
        },
        tipo_entrega: {
            type: Sequelize.STRING(20), allowNull: true
        },
        valor_total: {
            type: Sequelize.DECIMAL(10, 2), allowNull: true
        },
        status_venda: {
            type: Sequelize.STRING(20), allowNull: true
        }
    });

    return Venda;
}