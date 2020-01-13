const Koa = require('koa')
const bodyParser  = require('koa-bodyparser')

const InitManager = require('./core/initmanager')
const catchError = require('./middle/exception')

const app = new Koa()
app.use(bodyParser())
app.use(catchError)

InitManager.initCore(app)

app.listen(3000)
