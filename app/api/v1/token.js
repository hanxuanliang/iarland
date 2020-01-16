const Router = require('koa-router')
const { TokenValidator } = require('../../lib/validator')
const { LoginType } = require('../../lib/enum')
const { User } = require('../../models/user')
const { generateToken } = require('../../../core/util')

const router = new Router({
  prefix: '/v1/token'
})

router.post('/', async (ctx) => {
  const v = await new TokenValidator().validate(ctx)
  let token
  switch (v.get('body.type')) {
    case LoginType.USER_EMAIL:
      token = await emailLogin(v.get('body.account'), v.get('body.secret'))
      break
    case LoginType.USER_MINI_PROGRAM:
      break
    default:
      throw new global.errs.ParameterException('没有相应的处理类型')
  }
  ctx.body = {
    token
  }
})

/**
 * 如果符合账号和密码，就给该账号颁布token令牌
 */
async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret)
  return generateToken(user.id, 2)
}

module.exports = router
