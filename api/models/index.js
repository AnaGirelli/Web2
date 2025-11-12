// models/index.js
import Sequelize from 'sequelize';
import sequelize from '../config/database.js';
import ProdutoModel from './produto.js';

const Produto = ProdutoModel(sequelize, Sequelize);

export { Produto };
export default sequelize;
