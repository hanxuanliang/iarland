const Router = require('koa-router')
const bcrypt = require('bcryptjs')
const { RegisterValidator } = require('../../lib/validator')
const { User } = require('../../models/user')

const router = new Router({
  prefix: '/v1/user'
})

router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
  // 指的是花费成本，值越高成本越高
  const salt = bcrypt.genSaltSync(10)
  const psw = bcrypt.hashSync(v.get('body.password2'), salt)
  const user = {
    email: v.get('body.email'),
    password: psw,
    nickname: v.get('body.nickname')
  }
  const res = await User.create(user)

})

module.exports = router
