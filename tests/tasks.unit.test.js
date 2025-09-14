const sinon = require('sinon');
const { expect } = require('chai');
const tasksRouter = require('../src/tasks');

describe('Tasks Controller Unit', () => {
  it('should call next on valid JWT', () => {
    const req = { headers: { authorization: 'Bearer validtoken' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    const next = sinon.spy();
    // Mock jwt.verify para simular token válido
    const jwt = require('jsonwebtoken');
    const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, cb) => cb(null, { email: 'test@example.com' }));
    require('../src/auth').authMiddleware(req, res, next);
    expect(next.calledOnce).to.be.true;
    verifyStub.restore();
  });

  it('should not call next on missing JWT', () => {
    const req = { headers: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    const next = sinon.spy();
    require('../src/auth').authMiddleware(req, res, next);
    expect(res.status.calledWith(401)).to.be.true;
    expect(next.notCalled).to.be.true;
  });
});
