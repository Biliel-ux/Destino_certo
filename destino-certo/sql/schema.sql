-- Modelo para uma futura integração com PostgreSQL.
-- O back-end atual utiliza um arquivo JSON local.

CREATE TABLE IF NOT EXISTS solicitacoes_orcamento (
  id UUID PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  telefone VARCHAR(30),
  destino VARCHAR(120) NOT NULL,
  passageiros VARCHAR(20) NOT NULL,
  data_ida DATE,
  data_volta DATE,
  faixa_orcamento VARCHAR(80),
  observacoes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);