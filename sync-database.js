import sequelize from './mvc/config/database.js';
import {
    Pessoa,
    Categoria,
    UnidadeMedida,
    Produto,
    Venda,
    VendaProduto,
    Avaliacao
} from './mvc/models/index.js';

async function syncDatabase() {
    try {
        console.log('Testando conexão com o banco de dados...');
        await sequelize.authenticate();
        console.log('✓ Conexão estabelecida com sucesso!');

        console.log('\nCriando tabelas no banco de dados...');

        // Sincroniza as tabelas na ordem correta (respeitando dependências)
        // force: true vai dropar as tabelas se existirem e recriá-las
        // alter: true vai apenas alterar as tabelas para corresponder aos modelos
        await sequelize.sync({ force: true });

        console.log('✓ Tabelas criadas com sucesso!');
        console.log('\nTabelas criadas:');
        console.log('  - pessoa');
        console.log('  - categoria');
        console.log('  - unidademedida');
        console.log('  - produto');
        console.log('  - venda');
        console.log('  - vendaproduto');
        console.log('  - avaliacao');

        console.log('\n✓ Sincronização concluída!');

    } catch (error) {
        console.error('✗ Erro ao sincronizar banco de dados:', error);
    } finally {
        await sequelize.close();
        console.log('\nConexão com o banco de dados fechada.');
    }
}

syncDatabase();
