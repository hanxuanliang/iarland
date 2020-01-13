const { HttpException } = require('../core/http-exception')
/**
 * 全局异常处理中间件
 */
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch(error) {
    const isDev = global.config.environment === 'env'
    const isHttpException = error instanceof HttpException
    // 开发环境需要把错误堆栈暴露出来
    if (isDev) {
      throw error
      // 一旦抛出了异常，后续代码就不会再执行了
    }
    
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
