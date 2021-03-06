const { sequelize } = require("../../core/db")
const { Sequelize, Model } = require('sequelize')

const { Art } = require("./art")

const favorFields = {
  uid: Sequelize.INTEGER,
  art_id: Sequelize.INTEGER,
  type: Sequelize.INTEGER
}

/**
 * 1.favor业务表其实就是在点赞数时给他添加一条数据【用户id，对应喜欢模型数据id，对应模型】
 * 2.在favor表中插入数据的时候，同时也要在相应的模型表的 favNums 上 +1
 * 3.基于以上两条sql操作，可能出现原子操作，出现事务问题【要注意事务问题】
 */
class Favor extends Model{
  static async like(art_id, type, uid) {
    const favor = await Favor.findOne({ where: {art_id, uid, type}})
    if (favor) throw new global.errs.LikeFavorError()

    // 开启事务, 这里的事务一定要返回回去【看文档】
    return sequelize.transaction(async t => {
      await Favor.create({
        art_id, uid, type
      }, {transaction: t})
      // 传入 false 不进行scope去除
      const art = await Art.getData(art_id, type, false)
      // 另一个 SQL 操作，也需要附带 transaction 事务属性
      /**
       * BUG TODO 这个是官方的bug，就是在scope去除字段之后，
       * 再次去对该模型进行操作时，会发现sql语句的拼接出现问题，目前这个bug好像还没有修复
       */
      await art.increment("fav_nums", { by: 1, transaction: t })
    })
  }

  // dislike 这个操作和like基本差不多
  static async dislike(art_id, type, uid) {
    const favor = await Favor.findOne({ where: {art_id, uid, type}})
    if (!favor) throw new global.errs.DislikeFavorError()

    return sequelize.transaction(async t => {
      /**
       * 1.将查询出来的favor【一条查询出来的记录】做删除操作，而不是操作整个模型
       * 2.force 软删除【true为物理删除】，还要携带transaction
       */
      await favor.destroy({
        force: false, transaction: t 
      })
      const art = await Art.getData(art_id, type, false)
      // 另一个 SQL 操作，也需要附带 transaction 事务属性
      await art.decrement("fav_nums", { by: 1, transaction: t })
    })
  }

  static async isLike(uid, art_id, type) {
    const favor = await Favor.findOne({
      where: {uid, art_id, type}
    })
    return favor ? true : false
  }
}

Favor.init(favorFields, {
  sequelize,
  tableName: 'favor'
})

module.exports = { Favor }
