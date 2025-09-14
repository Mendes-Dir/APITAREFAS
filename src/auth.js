const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = [];
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

function generateToken(user) {
  return jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios.' });
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Usuário já existe.' });
  users.push({ email, password });
  res.status(201).json({ message: 'Usuário registrado com sucesso.' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });
  const token = generateToken(user);
  res.json({ token });
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido.' });
    req.user = user;
    next();
  });
}

module.exports = { router, authMiddleware };
