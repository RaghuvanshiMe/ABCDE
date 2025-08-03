const { User } = require('./models');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }
  const token = authHeader.slice(7);

  try {
    const user = await User.findOne({ where: { token } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = authMiddleware;
