const Router = require('koa-router')

const { PositiveIntegerValidator } = require('@validator')
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

  const art = await Art.getData(flow.art_id, flow.type)
  const isLike = await Favor.isLike(ctx.auth.uid, flow.art_id, flow.type)
  // TODO 涉及序列化的问题  --"这是一个很重要的问题"--
  art.setDataValue("index", flow.index)
  art.setDataValue("like_status", isLike)
  /**
   * TODO 其次的问题是有些表字段我们不想返回到前端：
   * 1.像上面一样set掉；
   * 2.在 query 的时候，可以exclude；
   * 3.scope + attributes，但是只有指定了scope的模型才能去除执行字段；
   * 4.所以想想是否可以在全局定义一个scope。
   */
  ctx.body = art
})

router.get('/:index/next', new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {id: "index"})
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: { index: index + 1 }
  })
  if (!flow) throw global.errs.NotFound()

  const art = await Art.getData(flow.art_id, flow.type)
  const likeNext = await Favor.isLike(ctx.auth.uid, flow.art_id, flow.type)
  art.setDataValue("index", flow.index)
  art.setDataValue("like_status", likeNext)
  ctx.body = art
})

router.get('/:index/previous', new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {id: "index"})
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: { index: index - 1 }
  })
  if (!flow) throw global.errs.NotFound()

  const art = await Art.getData(flow.art_id, flow.type)
  const likePrevious = await Favor.isLike(ctx.auth.uid, flow.art_id, flow.type)
  art.setDataValue("index", flow.index)
  art.setDataValue("like_status", likePrevious)
  ctx.body = art
})

module.exports = router
