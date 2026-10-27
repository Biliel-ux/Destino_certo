
require('dotenv').config();

const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5433,
  database: process.env.DB_NAME || 'destino_certo',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
});

pool.on('error', (error) => {
  console.error('Erro inesperado no PostgreSQL:', error.message);
});

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use(express.static(PUBLIC_DIR));

const destinos = [
  {
    id: 'rio',
    nome: 'Rio de Janeiro',
    descricao: 'Praias, cultura e paisagens inesquecíveis.'
  },
  {
    id: 'gramado',
    nome: 'Gramado',
    descricao: 'Natureza, gastronomia e clima acolhedor.'
  },
  {
    id: 'lisboa',
    nome: 'Lisboa',
    descricao: 'História, arquitetura e novos sabores.'
  }
];

function textoValido(valor, maximo) {
  return typeof valor === 'string' &&
    valor.trim().length > 0 &&
    valor.trim().length <= maximo;
}

function dataValida(data) {
  if (typeof data !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return false;
  }

  const [ano, mes, dia] = data.split('-').map(Number);
  const dataObj = new Date(Date.UTC(ano, mes - 1, dia));

  return dataObj.getUTCFullYear() === ano &&
    dataObj.getUTCMonth() === mes - 1 &&
    dataObj.getUTCDate() === dia;
}


app.get('/api/status', async (_req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT current_database() AS banco, current_user AS usuario'
    );

    res.json({
      status: 'ok',
      sistema: 'Destino Certo',
      banco: 'conectado',
      nomeBanco: resultado.rows[0].banco,
      usuario: resultado.rows[0].usuario
    });
  } catch (error) {
    console.error('Erro ao verificar o banco:', error);
  
    res.status(500).json({
      status: 'erro',
      banco: 'desconectado',
      mensagem: error.message
    });
  }
});

app.get('/api/destinos', (_req, res) => {
  res.json(destinos);
});


app.post('/api/orcamentos', async (req, res) => {
  const body = req.body || {};

  const nome = body.nome;
  const email = body.email;
  const destino = body.destino;
  const passageiros = String(
    body.passageiros == null ? '' : body.passageiros
  );
  const ida = body.ida || '';
  const volta = body.volta || '';
  const orcamento = body.orcamento || '';
  const observacoes = body.observacoes == null
    ? ''
    : body.observacoes;
  const telefone = body.telefone == null
    ? ''
    : body.telefone;

  if (!textoValido(nome, 120)) {
    return res.status(400).json({
      erro: 'Informe seu nome (até 120 caracteres).'
    });
  }

  if (!textoValido(email, 180) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      erro: 'Informe um e-mail válido.'
    });
  }

  if (!textoValido(destino, 120)) {
    return res.status(400).json({
      erro: 'Selecione o destino desejado.'
    });
  }

  if (!['1', '2', '3', '4 ou mais'].includes(passageiros)) {
    return res.status(400).json({
      erro: 'Selecione a quantidade de passageiros.'
    });
  }

  if (ida && !dataValida(ida)) {
    return res.status(400).json({
      erro: 'A data de ida é inválida.'
    });
  }

  if (volta && !dataValida(volta)) {
    return res.status(400).json({
      erro: 'A data de volta é inválida.'
    });
  }

  if (ida && volta && volta < ida) {
    return res.status(400).json({
      erro: 'A data de volta deve ser posterior ou igual à ida.'
    });
  }

  if (typeof telefone !== 'string' ||
      typeof observacoes !== 'string' ||
      observacoes.length > 1000 ||
      typeof orcamento !== 'string' ||
      orcamento.length > 80) {
    return res.status(400).json({
      erro: 'Confira telefone, orçamento e observações.'
    });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO solicitacoes_orcamento (
        id, nome, email, telefone, destino, passageiros,
        data_ida, data_volta, faixa_orcamento, observacoes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`,
      [
        crypto.randomUUID(),
        nome.trim(),
        email.trim(),
        telefone.trim().slice(0, 30),
        destino.trim(),
        passageiros === '4 ou mais' ? 4 : Number(passageiros),
        ida || null,
        volta || null,
        orcamento.trim(),
        observacoes.trim()
      ]
    );

    res.status(201).json({
      mensagem: 'Orçamento salvo no PostgreSQL.',
      id: resultado.rows[0].id
    });
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error.message);

    res.status(500).json({
      erro: 'Não foi possível salvar o orçamento.',
      detalhe: error.message
    });
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({
    erro: 'Rota da API não encontrada.'
  });
});

app.get('*path', (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Destino Certo disponível em http://localhost:${PORT}`);
  console.log(`Status: http://localhost:${PORT}/api/status`);
});

function encerrar() {
  server.close(async () => {
    try {
      await pool.end();
    } finally {
      process.exit(0);
    }
  });
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);
