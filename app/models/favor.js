const { sequelize } = require("../../core/db")
const { Sequelize, Model } = require('sequelize')

const { Art } = require("./art")

const favorFields = {
  uid: Sequelize.INTEGER,
  artId: Sequelize.INTEGER,
  type: Sequelize.INTEGER
}

/**
 * 1.favor业务表其实就是在点赞数时给他添加一条数据【用户id，对应喜欢模型数据id，对应模型】
 * 2.在favor表中插入数据的时候，同时也要在相应的模型表的 favNums 上 +1
 * 3.基于以上两条sql操作，可能出现原子操作，出现事务问题【要注意事务问题】
 */
class Favor extends Model{
  static async like(uid, artId, type) {
    const favor = await Favor.findOne({ where: {artId, uid, type}})
    if (favor) throw new global.errs.LikeFavorError()

    // 开启事务
    sequelize.transaction(async t => {
      await Favor.create({
        artId, uid, type
      }, {transaction: t})
      const art = Art.getData(artId, type)
      art.increment("fav_nums", { by: 1, transaction: t })
    })
  }

  static async dislike(uid, artId, type) {

  }
}

Favor.init(favorFields, {
  sequelize,
  tableName: 'favor'
})

module.exports = { Favor }
