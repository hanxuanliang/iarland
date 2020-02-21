const { unset, clone, isArray } = require('lodash')

const { Sequelize, Model } = require('sequelize') 
const { dbName, host, port, user, password } = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql', host, port, logging: true, timezone: '+08:00',
  define: {},
  define: {
    // 这个是做软删除的，会加一个 delete_time
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    scopes: {
      ex: {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at']
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
Model.prototype.toJSON = function() {
  // let data = this.dataValues
  let data = clone(this.dataValues)   // 使用浅拷贝，不影响原有的对象数据
  unset(data, 'created_at')
  unset(data, 'updated_at')
  unset(data, 'deleted_at')

  /**
   * 再次活用原型链，使用 Model 携带的exclude[]，还必须可以使用this引用，
   * 这个也就用到了原型链，动态在 Model 上添加属性
   */
  if (isArray(this.exclude)) {
    this.exclude.forEach(value => unset(data, value))
  }
  return data
}

module.exports = { sequelize }
