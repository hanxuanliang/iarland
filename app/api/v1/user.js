const Router = require('koa-router')
const { RegisterValidator } = require('../../lib/validator')
const { User } = require('../../models/user')

const router = new Router({
  prefix: '/v1/user'
})

router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
  const user = {
    email: v.get('body.email'),
    // 对password字段进行赋值的时候，会触发观察者模式，自动执行set()
    password: v.get('body.password2'),
    nickname: v.get('body.nickname')
  }
  const res = await User.create(user)
  // 返回成功消息的 “错误异常”
  throw new global.errs.Success()
})

module.exports = router
