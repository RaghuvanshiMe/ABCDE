const { app, sequelize } = require('./app');

const port = process.env.PORT || 8080;

sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
