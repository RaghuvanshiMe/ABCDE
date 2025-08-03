const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  token: { type: DataTypes.STRING, unique: true, allowNull: true },
  cartId: { type: DataTypes.INTEGER, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'users'
});

const Item = sequelize.define('Item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'items'
});

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.STRING, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'carts'
});

const CartItem = sequelize.define('CartItem', {
  cartId: { type: DataTypes.INTEGER, primaryKey: true },
  itemId: { type: DataTypes.INTEGER, primaryKey: true }
}, {
  timestamps: false,
  tableName: 'cart_items'
});

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cartId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'orders'
});

// Associations
User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Cart.belongsToMany(Item, { through: CartItem, foreignKey: 'cartId', otherKey: 'itemId' });
Item.belongsToMany(Cart, { through: CartItem, foreignKey: 'itemId', otherKey: 'cartId' });

Order.belongsTo(Cart, { foreignKey: 'cartId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Item,
  Cart,
  CartItem,
  Order
};
