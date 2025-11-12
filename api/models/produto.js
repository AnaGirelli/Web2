// models/produto.js
export default (sequelize, Sequelize) => {
  return sequelize.define('produto', {
    id_produto: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    id_vendedor: Sequelize.INTEGER,
    id_categoria: Sequelize.INTEGER,
    nome_produto: Sequelize.STRING,
    preco: Sequelize.DECIMAL(10,2),
    id_unidade_medida: Sequelize.INTEGER,
    ativo: Sequelize.BOOLEAN,
    url_imagem: Sequelize.STRING,
    estoque: {
      type: Sequelize.DECIMAL(10, 3),
      defaultValue: 0.000   
    }
  }, {
    tableName: 'produto', // Força o Sequelize a usar EXATAMENTE 'produto'
    freezeTableName: true,  // Garante que o nome não será pluralizado
    timestamps: false      // Desativa os campos automáticos de timestamp
  });
};