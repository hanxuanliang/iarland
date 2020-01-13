const { Sequelize, Model } = require('sequelize') 
const { dbName, host, port, user, password } = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql', host, port, logging: true
})
