const request = require('supertest');
const { app, sequelize } = require('../app');
const { User, Item, Cart, Order } = require('../models');

let token;
let cartId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Create a user and get token for auth
  const userRes = await request(app)
    .post('/users')
    .send({ username: 'orderuser', password: 'password123' });
  token = userRes.body.token;

  // Create an item
  const itemRes = await request(app)
    .post('/items')
    .send({ name: 'OrderItem1', status: 'available' });

  // Create a cart with the item
  const cartRes = await request(app)
    .post('/carts')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Order Cart', items: [itemRes.body.id] });
  cartId = cartRes.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Order Endpoints', () => {
  it('should create a new order', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ cart_id: cartId });
    expect(res.statusCode).toEqual(201);
    expect(res.body.cartId).toBe(cartId);
  });

  it('should list all orders', async () => {
    const res = await request(app)
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
