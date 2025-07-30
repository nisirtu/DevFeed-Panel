// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'painel_util_db',
  password: 'senha123', 
  port: 5432,
});

// --- Rota de Notícias (COM BUSCA MELHORADA) ---
app.get('/api/tech-news', async (req, res) => {
  try {
    let searchTerm = req.query.q || 'tecnologia';
    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Chave da API de notícias não configurada no servidor." });
    }

    // Expande abreviações para termos de busca melhores.
    if (searchTerm.toLowerCase() === 'ia') {
      searchTerm = 'inteligência artificial';
    }

    const encodedSearchTerm = encodeURIComponent(searchTerm);
    
    // Adiciona 'sortBy=publishedAt' para ordenar por data.
    const url = `https://gnews.io/api/v4/search?q=${encodedSearchTerm}&lang=pt&country=br&max=10&topic=technology&sortBy=publishedAt&apikey=${apiKey}`;
    
    const response = await axios.get(url);
    res.json(response.data.articles || []);
  } catch (error) {
    console.error("Erro ao buscar notícias:", error.message);
    res.status(500).json({ message: "Erro interno ao buscar notícias." });
  }
});

// --- Rota de Registro ---
app.post('/api/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Email, senha e nome completo são obrigatórios.' });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name",
      [email, passwordHash, fullName]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// --- Rota de Login ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }
    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO',
            { expiresIn: '1h' }
        );
        res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// --- Rota de Verificação de Token ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });
  jwt.verify(token, process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido.' });
    req.user = user;
    next();
  });
};
app.get('/api/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const userResult = await pool.query("SELECT id, email, full_name FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json(userResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});