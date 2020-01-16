const { Sequelize, Model } = require('sequelize')
const bcrypt = require('bcryptjs')

const { sequelize } = require('../../core/db')

class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({
      where: { email }
    })
    if (!user) { throw new global.errs.NotFound('账号不存在') }

    // 数据库中的密码是加密的，比较规则为先把
    const correct = bcrypt.compareSync(plainPassword, user.password)
    if (!correct) { throw new global.errs.AuthFailed('密码不正确') }
    
    return user
  }
}

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
    // 每当我们对模型字段进行赋值的时候，sequelize会自动调用set
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
