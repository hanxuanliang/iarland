const Router = require('koa-router')

const router = new Router()

router.post('/v1/:id/book/latest', (ctx, next) => {

  // -- 获取ctx中的各种参数姿势 --
  // const path = ctx.params
  // const query = ctx.request.query
  // const headers = ctx.request.header
  // const body = ctx.request.body
  
  ctx.body = {
    key: 'book'
  }
})

module.exports = router
