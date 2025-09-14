const { ApolloServer, gql } = require('apollo-server-express');
const { authMiddleware } = require('./auth');
const tasksModule = require('./tasks');

// Reutiliza o array de tarefas do módulo REST
let tasks = [];
try {
  // Se tasks.js exportar o array, reutiliza
  tasks = require('./tasks').tasks || tasks;
} catch {}

const typeDefs = gql`
  type Task {
    id: Int!
    title: String!
    description: String!
    status: String!
    assignee: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    tasks: [Task!]!
    task(id: Int!): Task
  }

  type Mutation {
    createTask(title: String!, description: String!, status: String, assignee: String): Task!
    updateTask(id: Int!, title: String, description: String, status: String, assignee: String): Task
    deleteTask(id: Int!): Boolean
  }
`;

let nextId = 1;

const resolvers = {
  Query: {
    tasks: () => tasks,
    task: (_, { id }) => tasks.find(t => t.id === id)
  },
  Mutation: {
    createTask: (_, { title, description, status = 'To Do', assignee }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      const task = {
        id: nextId++,
        title,
        description,
        status,
        assignee: assignee || context.user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      tasks.push(task);
      return task;
    },
    updateTask: (_, { id, title, description, status, assignee }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error('Tarefa não encontrada');
      if (title) task.title = title;
      if (description) task.description = description;
      if (status) task.status = status;
      if (assignee) task.assignee = assignee;
      task.updatedAt = new Date().toISOString();
      return task;
    },
    deleteTask: (_, { id }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      const idx = tasks.findIndex(t => t.id === id);
      if (idx === -1) throw new Error('Tarefa não encontrada');
      tasks.splice(idx, 1);
      return true;
    }
  }
};

function getUserFromReq(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    return require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'supersecret');
  } catch {
    return null;
  }
}

function setupGraphQL(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: getUserFromReq(req) })
  });
  server.start().then(() => {
    server.applyMiddleware({ app, path: '/graphql' });
  });
}

module.exports = setupGraphQL;
