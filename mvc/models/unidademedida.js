export default (sequelize, Sequelize) => {
    return sequelize.define('unidademedida', {
        id_unidade_medida: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome_unidade_medida: {
            type: Sequelize.STRING(50),
            allowNull: true 
        }
    }, {
        tableName: 'unidademedida',
        freezeTableName: true,
        timestamps: false
    });
};