const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
var cors = require('koa-cors');

const proxy = require('koa-proxies')
const httpsProxyAgent = require('https-proxy-agent')

const index = require('./routes/index')
const users = require('./routes/users')

const PROXY_PATH = 'http://test.admin.apsaras.teddymobile.net'

// error handler
onerror(app)

// middlewares
app.use(cors())
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/public/', {
  // extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  ctx.response.headers['Content-Type'] = 'application/json'
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// proxy
app.use(proxy('/api', {
  target: PROXY_PATH,
  changeOrigin: true,
  agent: new httpsProxyAgent(PROXY_PATH),
  logs: true
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
