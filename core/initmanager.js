const Router = require('koa-router')
const requireDirectory = require('require-directory')
/**
 * 初始化管理器，管理整个项目的初始化
 */
class InitManager {

  static initCore(app) {
    InitManager.app = app
    InitManager.initLoadRouters()
    InitManager.loadHttpException()
    InitManager.loadConfig()
  }

  static loadConfig (path='') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
  }

  static initLoadRouters() {
    // 要注意路径问题：process.cwd() 整个项目的绝对路径
    const apiDirectory = `${process.cwd()}/app/api`
    requireDirectory(module, apiDirectory, {
      visit: LoadModule
    })

    function LoadModule(obj) {
      if(obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }

  // 全局导入错误异常，看个人选择
  static loadHttpException() {
    const errors = require('./http-exception')
    global.errs = errors
  }
}

module.exports = InitManager
