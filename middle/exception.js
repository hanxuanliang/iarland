const { HttpException } = require('../core/http-exception')
/**
 * 全局异常处理中间件
 */
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch(error) {
    const isHttpException = error instanceof HttpException
    if (isHttpException) {
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    } else {
      ctx.body = {
        msg: 'make a mistake',
        error_code: 996,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError
