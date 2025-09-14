const request = require('supertest');
const app = require('../src/app');
const { expect } = require('chai');

let token;
describe('Tasks Endpoints', () => {
  before(async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'tasker@example.com', password: '123456' });
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'tasker@example.com', password: '123456' });
    token = res.body.token;
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Nova Tarefa', description: 'Descrição da tarefa' });
    expect(res.status).to.equal(201);
    expect(res.body.title).to.equal('Nova Tarefa');
  });

  it('should list tasks', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should update a task', async () => {
    const createRes = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Atualizar', description: 'Desc' });
    const id = createRes.body.id;
    const res = await request(app)
      .put(`/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Done' });
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('Done');
  });

  it('should delete a task', async () => {
    const createRes = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Deletar', description: 'Desc' });
    const id = createRes.body.id;
    const res = await request(app)
      .delete(`/tasks/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(204);
  });
});
