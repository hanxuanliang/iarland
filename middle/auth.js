const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

class Auth {
  constructor() {

  }

  get m() {
    return async(ctx, next) => {
      const userToken = basicAuth(ctx.req)
      let errMsg = 'token不合法'
      if (!userToken || !userToken.name) {
        throw new global.errs.Forbidden()
      }
      try {
        const decode = jwt.verify(userToken.name, global.config.security.secretKey)
      } catch(error) {
        // 1. token过期
        if (error.name == 'TokenExpiredError') {
          errMsg = 'token已过期'
        }
        // 2. token不合法，随意传了一个token
        throw new global.errs.Forbidden(errMsg)
      }

      // 在此处取出我们在jwt中存放的 uid，scope，以便后续的代码需要
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }

      // 还是那句话，next让后续的中间件执行
      await next()
    }
  }
}

module.exports = { Auth }
