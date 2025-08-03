const request = require('supertest');
const { app, sequelize } = require('../app');
const { User, Item, Cart } = require('../models');

let token;
let itemId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Create a user and get token for auth
  const userRes = await request(app)
    .post('/users')
    .send({ username: 'cartuser', password: 'password123' });
  token = userRes.body.token;

  // Create an item to add to cart
  const itemRes = await request(app)
    .post('/items')
    .send({ name: 'CartItem1', status: 'available' });
  itemId = itemRes.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Cart Endpoints', () => {
  it('should create a new cart', async () => {
    const res = await request(app)
      .post('/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'My Cart', items: [itemId] });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe('My Cart');
    expect(res.body.Items.length).toBe(1);
  });

  it('should list all carts', async () => {
    const res = await request(app)
      .get('/carts')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
