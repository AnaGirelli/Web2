export default (sequelize, Sequelize) => {
    return sequelize.define('chat', {
        id_chat: {
            type: Sequelize.INTEGER,
            autoIncrement: true, 
            allowNull: false, 
            primaryKey: true
        },
        id_cliente: {
            type: Sequelize.INTEGER, 
            allowNull: true
        },
        id_vendedor: {
            type: Sequelize.INTEGER, 
            allowNull: true
        },
        data_inicio: {
            type: Sequelize.DATE, 
            allowNull: true
        },
        status: {
            type: Sequelize.STRING(50), 
            allowNull: true
        }
    }, {
        tableName: 'chat', // Força o Sequelize a usar EXATAMENTE 'chat'
        freezeTableName: true, // Garante que o nome não será pluralizado
        timestamps: false // Desativa os campos automáticos de timestamp
    });
};