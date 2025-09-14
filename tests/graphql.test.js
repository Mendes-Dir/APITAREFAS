const request = require('supertest');
const app = require('../src/app');
const { expect } = require('chai');

let token;
describe('GraphQL Endpoints', () => {
  before(async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'graphql@example.com', password: '123456' });
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'graphql@example.com', password: '123456' });
    token = res.body.token;
  });

  it('should create a task via mutation', async () => {
    const mutation = `mutation { createTask(title: "Tarefa GraphQL", description: "Desc") { id title } }`;
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutation });
    expect(res.body.data.createTask.title).to.equal('Tarefa GraphQL');
  });

  it('should list tasks via query', async () => {
    const query = `{ tasks { id title } }`;
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query });
    expect(res.body.data.tasks).to.be.an('array');
  });

  it('should update a task via mutation', async () => {
    const mutationCreate = `mutation { createTask(title: "Atualizar GraphQL", description: "Desc") { id } }`;
    const createRes = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutationCreate });
    const id = createRes.body.data.createTask.id;
    const mutationUpdate = `mutation { updateTask(id: ${id}, status: "Done") { id status } }`;
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutationUpdate });
    expect(res.body.data.updateTask.status).to.equal('Done');
  });

  it('should delete a task via mutation', async () => {
    const mutationCreate = `mutation { createTask(title: "Deletar GraphQL", description: "Desc") { id } }`;
    const createRes = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutationCreate });
    const id = createRes.body.data.createTask.id;
    const mutationDelete = `mutation { deleteTask(id: ${id}) }`;
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: mutationDelete });
    expect(res.body.data.deleteTask).to.be.true;
  });
});
