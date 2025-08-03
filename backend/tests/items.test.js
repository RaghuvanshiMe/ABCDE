const request = require('supertest');
const { app, sequelize } = require('../app');
const { User, Item } = require('../models');

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Create a user and get token for auth
  const res = await request(app)
    .post('/users')
    .send({ username: 'itemuser', password: 'password123' });
  token = res.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Item Endpoints', () => {
  it('should create a new item', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'Item1', status: 'available' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe('Item1');
  });

  it('should list all items', async () => {
    const res = await request(app)
      .get('/items');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
