const Router = require('koa-router')

const { Auth } = require('../../../middle/auth')
const { LikeFavorValidator } = require('../../lib/validator')
const { Favor } = require('../../models/favor')

const router = new Router({
  prefix: '/v1/like'
})

router.post("/", new Auth().m, async (ctx, next) => {
  // Validator 支持别名 【validate(ctx, {id: 'art_id'})】
  // 将验证的字段改名
  const v = await new LikeFavorValidator().validate(ctx, {id: 'art_id'})
  await Favor.like(v.get("body.art_id"), v.get("body.type"), ctx.auth.uid)
  throw new global.errs.Success()
})

router.post("/cancel", new Auth().m, async (ctx, next) => {
  const v = await new LikeFavorValidator().validate(ctx, {id: 'art_id'})
  await Favor.dislike(v.get("body.art_id"), v.get("body.type"), ctx.auth.uid)
  throw new global.errs.Success()
})

module.exports = router
