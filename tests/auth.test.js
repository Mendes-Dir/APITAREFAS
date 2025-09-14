const request = require('supertest');
const app = require('../src/app');
const { expect } = require('chai');

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: '123456' });
    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal('Usuário registrado com sucesso.');
  });

  it('should not register duplicate user', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'test2@example.com', password: '123456' });
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test2@example.com', password: '123456' });
    expect(res.status).to.equal(409);
  });

  it('should login with valid credentials', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'login@example.com', password: '123456' });
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'login@example.com', password: '123456' });
    expect(res.status).to.equal(200);
    expect(res.body.token).to.be.a('string');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'fail@example.com', password: 'wrong' });
    expect(res.status).to.equal(401);
  });
});
