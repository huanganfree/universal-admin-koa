const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});


async function testConnectDatabase() {
    await sequelize.authenticate();
    await sequelize.sync({force: false})
    console.log('test === Connection has been established successfully.');
  }
  
  try {
    testConnectDatabase();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }


module.exports = {
    sequelize
}