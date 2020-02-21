// pages/test_page/test_page.js
import { Base64 } from 'js-base64'

Page({
  onGetToken() {
    // 小程序内置了login()可以获取code
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: 'http://localhost:3000/v1/token',
            method: 'POST',
            data: {
              account: res.code,
              type: 100
            },
            success: (res) => {
              console.log(res.data)
              const code = res.statusCode.toString()
              if (code.startsWith('2')) {
                wx.setStorageSync('token', res.data.token)
              }
            }
          })
        }
      }
    })
  },

  onVerifyToken() {
    wx.request({
      url: 'http://localhost:3000/v1/token/verify',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res.data)
      }
    })
  },

  onGetLatest() {
    /**
     * 1.小程序中携带令牌，需要在header头部加上 Authorization 字段；
     * 2.Authorization的格式：
     *    Authorization:Basic base64(account:password)
     *    已经有Base64将token加密；因为此接口需要携带token才能访问，所以这里的
     *    Authorization就是token的base64加密信息
     */
    wx.request({
      url: 'http://localhost:3000/v1/classic/latest',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },

  onLike() {
    wx.request({
      url: 'http://localhost:3000/v1/like',
      method: 'POST',
      data: {
        art_id: 1,
        type: 100
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },

  onDislike() {
    wx.request({
      url: 'http://localhost:3000/v1/like/cancel',
      method: 'POST',
      data: {
        art_id: 1,
        type: 100
      },
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },

  onGetNext() {
    wx.request({
      url: 'http://localhost:3000/v1/classic/6/next',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },

  onGetPrevious() {
    wx.request({
      url: 'http://localhost:3000/v1/classic/6/previous',
      method: 'GET',
      success: res => {
        console.log(res.data)
      },
      header: {
        Authorization: this._encode()
      }
    })
  },

  _encode() {
    const token = wx.getStorageSync("token")
    const base64 = Base64.encode(token + ":")
    return `Basic ${base64}` 
  }
})
