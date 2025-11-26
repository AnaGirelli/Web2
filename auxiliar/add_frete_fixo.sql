-- Script para adicionar a coluna frete_fixo na tabela pessoa
-- Execute este script no banco de dados PostgreSQL

ALTER TABLE pessoa 
ADD COLUMN IF NOT EXISTS frete_fixo DECIMAL(10,2) DEFAULT 0.00;

-- Verificar se a coluna foi criada
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'pessoa' AND column_name = 'frete_fixo';

