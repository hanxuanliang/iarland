/**
 * 整个项目的枚举
 * 模拟枚举
 */
function isOneofType(type) {
  for (let key in this) {
    if (this[key] === type) { return true }
  }
  return false
}

const LoginType = {
  USER_MINI_PROGRAM: 100,
  USER_EMAIL: 101,
  USER_MOBILE: 102,
  ADMIN_EMAIL: 105,
  isOneofType
}

const ArtType = {
  MOVIE: 100,
  MUSIC: 200,
  SENTENCE: 300,
  BOOK: 400,
  isOneofType
}

module.exports = { LoginType, ArtType }
