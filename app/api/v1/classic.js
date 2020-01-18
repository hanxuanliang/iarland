const Router = require('koa-router')

const { PositiveIntegarValidator } = require('../../lib/validator')
const { Auth } = require('../../../middle/auth')

const router = new Router({
  prefix: '/v1/classic'
})

router.get('/latest', new Auth().m, async (ctx, next) => {
  ctx.body = ctx.auth.uid
})

module.exports = router
