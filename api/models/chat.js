module.exports = (sequelize, Sequelize) => {
    const Chat = sequelize.define('chat', {
        id_chat: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        id_cliente: {
            type: Sequelize.INTEGER, allowNull: true
        },
        id_vendedor: {
            type: Sequelize.INTEGER, allowNull: true
        },
        data_inicio: {
            type: Sequelize.DATE, allowNull: true
        },
        status_chat: {
            type: Sequelize.STRING(50), allowNull: true
        }
    });

    return Chat;
}