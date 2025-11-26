// Script para adicionar a coluna descricao na tabela produto
import sequelize from '../mvc/config/database.js';

async function addDescricaoColumn() {
    try {
        console.log('Conectando ao banco de dados...');
        await sequelize.authenticate();
        console.log('✅ Conexão estabelecida com sucesso');

        // Adiciona a coluna descricao se ela não existir
        const query = `
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = 'produto' 
                    AND column_name = 'descricao'
                ) THEN
                    ALTER TABLE produto 
                    ADD COLUMN descricao VARCHAR(255);
                    RAISE NOTICE 'Coluna descricao adicionada com sucesso!';
                ELSE
                    RAISE NOTICE 'Coluna descricao já existe.';
                END IF;
            END $$;
        `;

        await sequelize.query(query);
        console.log('✅ Coluna descricao verificada/criada com sucesso!');
        
        // Verifica se a coluna foi criada
        const [results] = await sequelize.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'produto' AND column_name = 'descricao'
        `);
        
        if (results.length > 0) {
            console.log('✅ Verificação: Coluna descricao existe na tabela produto');
            console.log('   Tipo:', results[0].data_type);
        } else {
            console.log('⚠️  Aviso: Coluna não encontrada após criação');
        }

        await sequelize.close();
        console.log('✅ Processo concluído!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao adicionar coluna:', error);
        process.exit(1);
    }
}

addDescricaoColumn();

