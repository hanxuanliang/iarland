require("module-alias/register")    // 全局引入别名设置

const Koa = require('koa')
const bodyParser  = require('koa-bodyparser')

const InitManager = require('./core/initmanager')
const catchError = require('./middle/exception')

require('./app/models/user')

const app = new Koa()
app.use(catchError)
app.use(bodyParser())

InitManager.initCore(app)

app.listen(3000)
