SET client_encoding TO 'UTF8';

-- Pedidos de orçamento enviados pelo formulário do cliente
CREATE TABLE IF NOT EXISTS solicitacoes_orcamento (
  id UUID PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  telefone VARCHAR(30),
  destino VARCHAR(120) NOT NULL,
  passageiros INTEGER NOT NULL CHECK (passageiros >= 1),
  data_ida DATE,
  data_volta DATE,
  faixa_orcamento VARCHAR(80),
  observacoes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);