const { Sequelize, Model } = require('sequelize')
const { sequelize } = require("../../core/db")

const classicFields = {
  image:{
    type: Sequelize.STRING
  },
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  favNums:{
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  title: Sequelize.STRING,
  type: Sequelize.TINYINT
}

// Movie 模型
class Movie extends Model {}

Movie.init(classicFields, {
  sequelize,
  tableName: 'movie'
})

// Sentence 模型
class Sentence extends Model {}

Sentence.init(classicFields, {
  sequelize,
  tableName: 'sentence'
})

// Music 模型
class Music extends Model {}

Music.init(Object.assign({ url: Sequelize.STRING }, classicFields), {
  sequelize,
  tableName: 'music'
})
