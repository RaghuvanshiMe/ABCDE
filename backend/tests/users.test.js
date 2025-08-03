const request = require('supertest');
const { app, sequelize } = require('../app');
const { User } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('testuser');
  });

  it('should not register a user with existing username', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(400);
  });
});
