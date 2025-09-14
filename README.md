
# API de Tarefas

API Node.js para gerenciamento de tarefas, inspirado em modelos ágeis do Jira. Inclui autenticação JWT, endpoints REST e GraphQL, documentação Swagger, testes automatizados e CI/CD com GitHub Actions.

## Instalação

```bash
npm install
```

## Execução

```bash
npm start
```

## Testes

```bash
npm test
```

## Endpoints REST

- **POST /auth/register** — Registro de usuário `{ email, password }`
- **POST /auth/login** — Login e retorno do token JWT `{ email, password }`
- **POST /tasks** — Criação de tarefa (JWT obrigatório)
- **GET /tasks** — Listagem de tarefas (JWT obrigatório)
- **PUT /tasks/:id** — Atualização de tarefa (JWT obrigatório)
- **DELETE /tasks/:id** — Remoção de tarefa (JWT obrigatório)

### Modelo de Tarefa
```json
{
	"id": 1,
	"title": "Título",
	"description": "Descrição",
	"status": "To Do | In Progress | Done",
	"assignee": "email",
	"createdAt": "2025-09-14T...",
	"updatedAt": "2025-09-14T..."
}
```

## GraphQL

- Playground: `/graphql`
- Query: `tasks { ... }`, `task(id: ...)`
- Mutations: `createTask`, `updateTask`, `deleteTask`

Exemplo de mutation:
```graphql
mutation {
	createTask(title: "Nova", description: "Desc") {
		id
		title
	}
}
```

## Swagger

- Documentação interativa: `/api-docs`

## Pipeline CI

Workflow: `.github/workflows/test.yml`
- Instala Node.js
- Instala dependências
- Executa testes automatizados

## Estrutura do Projeto

- `/src`: código da API (auth, tasks, graphql, app)
- `/tests`: testes automatizados (REST, GraphQL, unitários)
- `/docs`: configurações Swagger
- `README.md`: documentação
- `.github/workflows/test.yml`: CI/CD
- `.gitignore`: arquivos ignorados

## Como usar

1. Instale dependências: `npm install`
2. Execute a API: `npm start` (porta padrão 3000)
3. Teste endpoints REST e GraphQL usando JWT
4. Acesse documentação Swagger em `/api-docs`
5. Execute testes: `npm test`
6. CI/CD: push/pull request na branch `main` executa testes automaticamente

---
Projeto para fins didáticos, seguindo melhores práticas de Node.js, Express, JWT, GraphQL, Swagger, Mocha, Chai, Supertest, Sinon e GitHub Actions.
