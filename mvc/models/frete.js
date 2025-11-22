export default (sequelize, Sequelize) => {
    return sequelize.define('frete', {
        id_frete: {
            type: Sequelize.INTEGER,
            autoIncrement: true, 
            allowNull: false, 
            primaryKey: true
        },
        id_vendedor: {
            type: Sequelize.INTEGER, 
            allowNull: true
        },
        id_bairro: {
            type: Sequelize.INTEGER, 
            allowNull: true
        },
        preco: {
            type: Sequelize.DECIMAL(10, 2), 
            allowNull: true
        }
    }, {
        tableName: 'frete', // Força o Sequelize a usar EXATAMENTE 'frete'
        freezeTableName: true, // Garante que o nome não será pluralizado
        timestamps: false // Desativa os campos automáticos de timestamp
    });
};