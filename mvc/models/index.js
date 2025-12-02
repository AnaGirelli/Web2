
import Sequelize from 'sequelize';
import sequelize from '../config/database.js'; // Conexão com o banco de dados

// Importação dos modelos
import ProdutoModel from './produto.js';
import PessoaModel from './pessoa.js';
import AvaliacaoModel from './avaliacao.js';
import VendaModel from './venda.js';
import VendaProdutoModel from './vendaproduto.js';
import CategoriaModel from './categoria.js';
import UnidadeMedidaModel from './unidademedida.js';

// Inicialização dos modelos
const Produto = ProdutoModel(sequelize, Sequelize);
const Pessoa = PessoaModel(sequelize, Sequelize);
const Avaliacao = AvaliacaoModel(sequelize, Sequelize);
const Venda = VendaModel(sequelize, Sequelize);
const VendaProduto = VendaProdutoModel(sequelize, Sequelize);
const Categoria = CategoriaModel(sequelize, Sequelize);
const UnidadeMedida = UnidadeMedidaModel(sequelize, Sequelize);


// Exportação de todos os modelos para uso nos controllers
export { 
    Produto, 
    Pessoa, 
    Avaliacao, 
    Venda, 
    VendaProduto,
    Categoria,
    UnidadeMedida
};

// Exportação da instância do Sequelize
export default sequelize;