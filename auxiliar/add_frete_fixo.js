// Script para adicionar a coluna frete_fixo na tabela pessoa
import sequelize from '../mvc/config/database.js';

async function addFreteFixoColumn() {
    try {
        console.log('Conectando ao banco de dados...');
        await sequelize.authenticate();
        console.log('✅ Conexão estabelecida com sucesso');

        // Adiciona a coluna frete_fixo se ela não existir
        const query = `
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = 'pessoa' 
                    AND column_name = 'frete_fixo'
                ) THEN
                    ALTER TABLE pessoa 
                    ADD COLUMN frete_fixo DECIMAL(10,2) DEFAULT 0.00;
                    RAISE NOTICE 'Coluna frete_fixo adicionada com sucesso!';
                ELSE
                    RAISE NOTICE 'Coluna frete_fixo já existe.';
                END IF;
            END $$;
        `;

        await sequelize.query(query);
        console.log('✅ Coluna frete_fixo verificada/criada com sucesso!');
        
        // Verifica se a coluna foi criada
        const [results] = await sequelize.query(`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'pessoa' AND column_name = 'frete_fixo'
        `);
        
        if (results.length > 0) {
            console.log('✅ Verificação: Coluna frete_fixo existe na tabela pessoa');
            console.log('   Tipo:', results[0].data_type);
            console.log('   Default:', results[0].column_default);
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

addFreteFixoColumn();

