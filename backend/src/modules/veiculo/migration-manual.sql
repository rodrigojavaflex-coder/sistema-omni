-- Script SQL para adicionar os novos campos à tabela veiculos
-- Executar manualmente no banco de dados

-- Adicionar coluna status
ALTER TABLE veiculos ADD COLUMN status character varying(20) DEFAULT 'ATIVO' NOT NULL;

-- Adicionar coluna marca_da_carroceria
ALTER TABLE veiculos ADD COLUMN "marcaDaCarroceria" character varying(50);

-- Adicionar coluna modelo_da_carroceria  
ALTER TABLE veiculos ADD COLUMN "modeloDaCarroceria" character varying(50);

-- Criar índice para status
CREATE INDEX IDX_VEICULO_STATUS ON veiculos(status);
