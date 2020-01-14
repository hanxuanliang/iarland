const { Sequelize, Model } = require('sequelize')
const bcrypt = require('bcryptjs')

const { sequelize } = require('../../core/db')

class User extends Model { }

User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nickname: Sequelize.STRING,
  email: {
    type: Sequelize.STRING(128),
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    set(val) {
      // 指的是花费成本，值越高成本越高
      const salt = bcrypt.genSaltSync(10)
      const psw = bcrypt.hashSync(val, salt)
      this.setDataValue('password', psw)
    }
  },
  openid: {
    type: Sequelize.STRING(64),
    unique: true
  }
}, { 
  sequelize,
  tableName: 'user'
})

module.exports = { User }
