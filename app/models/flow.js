const { sequelize } = require("../../core/db")
const { Sequelize, Model } = require('sequelize')

/**
 * type 来区分具体是哪个模型；
 * art_id 来确定是哪个模型中的哪条具体的数据；
 * index 表示期刊数，也就是第几期
 */
const flowFields = {
  index: Sequelize.INTEGER,
  artId: Sequelize.INTEGER,
  type: Sequelize.INTEGER 
}

class Flow extends Model {}

// 抽象表 Flow 只是个业务表
Flow.init(flowFields, {
  sequelize,
  tableName: 'flow'
})

module.exports = {
  Flow
}
