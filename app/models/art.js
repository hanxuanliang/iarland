// 存放一些含有逻辑的 flow model 返回结果
const { Movie, Sentence, Music } = require('./classic')

class Art {
  /**
   * 通过 类目(type) id(对应类目的id) 来查询
   */
  static async getData(art_id, type, useScope = true) {
    let art = null
    // 如果在scope中传入null，不会应用scope
    const scope = useScope ? 'ex' : null
    /**
     * MOVIE:100,
     * MUSIC:200,
     * SENTENCE:300,
     * BOOK:400
     */
    switch (type) {
      case 100:
        art = await Movie.scope(scope).findOne({ 
          where: {id: art_id} 
        })
        break
      case 200:
        art = await Music.scope(scope).findOne({ 
          where: {id: art_id} 
        })
        break
      case 300:
        art = await Sentence.scope(scope).findOne({ 
          where: {id: art_id} 
        })
        break
      case 400:
        break
      default:
        break
    }
    return art
  }
}

module.exports = {
  Art
}
