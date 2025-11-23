export default (sequelize, Sequelize) => {
    return sequelize.define('categoria', {
        id_categoria: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome_categoria: {
            type: Sequelize.STRING(50), 
            allowNull: true // Se quiser que seja obrigatório, mude para 'false'
        }
    }, {
        tableName: 'categoria',
        freezeTableName: true,
        timestamps: false
    });
};