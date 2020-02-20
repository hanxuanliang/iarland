const { Sequelize, Model } = require('sequelize') 
const { dbName, host, port, user, password } = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql', host, port, logging: true, timezone: '+08:00',
  define: {},
  define: {
    // 这个是做软删除的，会加一个 delete_time
    paranoid: true,
    createdAt: 'create_at',
    updateAt: 'update_at',
    deleteAt: 'delete_at',
    underscored: true,
    scopes: {
      ex: {
        attributes: {
          exclude: ['create_at', 'update_at', 'delete_at']
        }
      }
    }
  }
})

/**
 * 帮助你根据模型类创建表
 * (注意这个force不要随便加，他是每次把上次生成的表删除掉，在重新生成一次) 
 * */ 
sequelize.sync({
  force: false
})

module.exports = { sequelize }
