const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa-cors');

const proxy = require('koa-proxy')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(cors())
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
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

const urlList = {
  '/api/shop': {
    target: 'http://192.168.4.75:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/api/shop': '/api/shop'
    }
  },
  '/shop': {
    target: 'http://47.94.151.150:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/shop': '/shop'
    }
  },
  '/msg': {
    target: 'http://47.94.151.150:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/msg': '/msg'
    }
  },
  '/jump': {
    target: 'http://47.94.151.150:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/jump': '/jump'
    }
  },
  '/api/taskRecord': {
    target: 'http://192.168.4.75:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/api/taskRecord': '/api/taskRecord'
    }
  },
  '/api/number': {
    target: 'http://192.168.4.75:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/api/number': '/api/number'
    }
  },
  '/api/content': {
    target: 'http://192.168.0.76:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/api/content': '/api/content'
    }
  },
  '/api/sys': {
    target: 'http://192.168.0.76:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/api/sys': '/api/sys'
    }
  },
  '/api': {
    target: 'http://192.168.0.76:8080',
    changeOrigin: true
  }
}
Object.keys(urlList).forEach(path => {
  app.use(proxy({
    host: urlList[path].target,
    match: new RegExp('^' + path),
    jar: true
  }))
})


// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
