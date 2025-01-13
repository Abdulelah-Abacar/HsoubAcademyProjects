require('dotenv/config');
const {sequelize, models} = require('./models');
const app = require('./app');

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log('Express Running');
  });
});
