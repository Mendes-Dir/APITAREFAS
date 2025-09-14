const express = require('express');
const bodyParser = require('body-parser');
const { router: authRouter, authMiddleware } = require('./auth');

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRouter);

const tasksRouter = require('./tasks');
app.use('/tasks', tasksRouter);

const setupGraphQL = require('./graphql');
setupGraphQL(app);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas protegidas de exemplo
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Acesso autorizado!', user: req.user });
});

module.exports = app;
