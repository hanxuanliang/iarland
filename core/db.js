const { unset, clone } = require('lodash')

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
 * 帮助你根据模型类创建表；
 * (注意这个force不要随便加，他是每次把上次生成的表删除掉，在重新生成一次) 
 */
sequelize.sync({
  force: false
})

/**
 * 自定义JSON序列化，将 toJSON() 接在Model上
 * 【因为Model是官方库的API，可以采用原型链的方式动态添加你的自定义】
 */
Model.prototype.toJSON = () => {
  // let data = this.dataValues
  let data = clone(this.dataValues)   // 使用浅拷贝，不影响原有的对象数据
  unset(data, 'create_at')
  unset(data, 'update_at')
  unset(data, 'delete_at')
  return data
}

module.exports = { sequelize }
