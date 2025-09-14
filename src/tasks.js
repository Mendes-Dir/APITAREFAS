const express = require('express');
const { authMiddleware } = require('./auth');
const router = express.Router();

// Modelo de tarefa inspirado no Jira
let tasks = [];
let nextId = 1;

/*
Tarefa:
- id: número
- title: string
- description: string
- status: string ("To Do", "In Progress", "Done")
- assignee: string (email do responsável)
- createdAt: Date
- updatedAt: Date
*/

// Criar tarefa
router.post('/', authMiddleware, (req, res) => {
  const { title, description, status = 'To Do', assignee } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Título e descrição obrigatórios.' });
  const task = {
    id: nextId++,
    title,
    description,
    status,
    assignee: assignee || req.user.email,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  tasks.push(task);
  res.status(201).json(task);
});

// Listar tarefas
router.get('/', authMiddleware, (req, res) => {
  res.json(tasks);
});

// Atualizar tarefa
router.put('/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Tarefa não encontrada.' });
  const { title, description, status, assignee } = req.body;
  if (title) task.title = title;
  if (description) task.description = description;
  if (status) task.status = status;
  if (assignee) task.assignee = assignee;
  task.updatedAt = new Date();
  res.json(task);
});

// Deletar tarefa
router.delete('/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Tarefa não encontrada.' });
  tasks.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;
