/**
 * 全局配置项
 */
module.exports = {
  // prod ; dev
  environment: 'dev',
  database: {
    dbName: 'iarland',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Your password'
  },
  security: {
    secretKey: 'Your Key by own',
    expiresIn: 60*60
  },
  wx: {
    appId: '',
    appSecret: '',
    // 微信给的登录凭证校验的请求地址
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  }
}
