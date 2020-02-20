const Router = require('koa-router')

const { PositiveIntegarValidator } = require('@validator')
const { Auth } = require('../../../middle/auth')
const { Flow } = require("@models/flow")
const { Art } = require("@models/art")
const { Favor } = require("@models/favor")

const router = new Router({
  prefix: '/v1/classic'
})

router.get('/latest', new Auth().m, async (ctx, next) => {
  const flow = await Flow.findOne({
    order: [
      ["index", "DESC"]
    ]
  })

  const art = await Art.getData(flow.artId, flow.type)
  const isLike = await Favor.isLike(ctx.auth.uid, flow.artId, flow.type)
  // TODO 涉及序列化的问题  --"这是一个很重要的问题"--
  art.setDataValue("index", flow.index)
  art.setDataValue("like_status", isLike)
  ctx.body = art
})

module.exports = router
