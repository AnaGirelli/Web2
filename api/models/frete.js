module.exports = (sequelize, Sequelize) => {
    const Frete = sequelize.define('frete', {
        id_frete: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        id_vendedor: {
            type: Sequelize.INTEGER, allowNull: true
        },
        id_bairro: {
            type: Sequelize.INTEGER, allowNull: true
        },
        preco: {
            type: Sequelize.DECIMAL(10, 2), allowNull: true
        }
    });

    return Frete;
}