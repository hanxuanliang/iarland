/**
 * 整个项目所需的校验器
 */
const { LinValidator, Rule } = require('../../core/validator-v2')

class PositiveIntegarValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '必须是整数', { min: 1 })
    ]
  }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [
      new Rule('isEmail', '电子邮箱不符合规范，请输入正确的邮箱')
    ]
    this.password1 = [
      new Rule('isLength', '密码至少6个字符，最多32个字符', { min: 6, max: 32 }),
      new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')    
    ]
    this.password2 = this.password1
    this.nickname = [
      new Rule('isLength', '昵称不符合长度规范', { mix: 4, max: 10 })
    ]
  }

  validatePassword(vals) {
    const password1 = vals.body.password1
    const password2 = vals.body.password2
    if (password1 !== password2) {
      throw new Error('两次密码不一致')
    }
  }

  async validateEmail(vals) {
    const email = vals.body.email
    const user = await User.findOne({
      where: {
        email: email, 
      } 
    })
    if (user) {
      throw new Error('email已存在')
    }
  }
}

module.exports = {
  PositiveIntegarValidator,
  RegisterValidator
}