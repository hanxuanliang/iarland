const util = require('util')
const axios = require('axios')

const { User } = require('../models/user')
const { loginUrl, appId, appSecret } = require('../../config/config').wx
const { Auth } = require('../../middle/auth')
const { generateToken } = require('../../core/util')

/**
 *小程序的Service逻辑层
 */
class WxService {
  static async code2Token(code) {
    /**
     * 微信小程序的登陆逻辑：
     * 1. 小程序会生成一个code，我们将这个code发送给微信后端
     * 2. 由微信后端给验证这个code的合法性，再返回用户一个唯一的openid
     * 3. 而微信小程序登陆过程是没有显示的注册功能的；没有注册就会先帮你注册，再登陆
     * 4. 我们发送给小程序后台需要3个参数：
     *    code  appid  appsecret【是关于小程序本身的】
     * 具体流程：
     *    https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
     */
    const url = util.format(loginUrl, appId, appSecret, code)

    const result = await axios.get(url)
    if (result.status !== 200) {
      throw new global.errs.AuthFailed('openid获取失败')
    }
    const errcode = result.data.errcode
    const errmsg = result.data.errmsg
    if (errcode !== 0) {
      throw new global.errs.AuthFailed(
        'openid获取失败：' + errcode + ' / ' + errmsg)
    }

    const openid = result.data.openid
    let user = await User.getUserByOpenid(openid)
    if (!user) {
      user = await User.registerByOpenid(openid) 
    }
    return generateToken(user.id, Auth.USER)
  }
}

module.exports = { WxService }
