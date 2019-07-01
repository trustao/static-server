const router = require('koa-router')()
const fs = require('fs')
const BIData = require('./BiData')

router.all('/teddybi/*',async (ctx, next) => {
  await new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove()
    }, 500)
  }).then(() => {
    ctx.body = BIData[ctx.path.replace('/teddybi', '')] || ''
  })
})

const shortLink = {}
router.post('/link', async (ctx, next) => {
  try {
    const url = JSON.parse(ctx.request.body).url
    if (url) {
      const key = Date.now().toString(32).slice(2)
      shortLink[key] = url
      ctx.body = `/sl/${key}`;
    }
  } catch (e) {
    ctx.body = 'error';
  }
})
router.get('/sl/:key', async(ctx, next) => {
  ctx.redirect(shortLink[ctx.params.key])
})
router.all('/teddybi/*',async (ctx, next) => {
  await new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove()
    }, 500)
  }).then(() => {
    ctx.body = BIData[ctx.path.replace('/teddybi', '')] || ''
  })
})

router.get('/test/a', async (ctx, next) => {
  await new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove()
    }, 3000 + ((Math.random() * 4000 ) |  0))
  }).then(() => {
    ctx.body = {'test': 'a'}
  })
})

router.get('/test/b', async (ctx, next) => {
  ctx.body = {'test': 'b'}
})

router.get('/data_analysis_fe/*',  async (ctx, next) => {
  await ctx.render('data_analysis_fe/index.html')
})

router.get('/re', async (ctx, next) => {
  ctx.redirect('http://localhost:9800/#/login?token=a9f6d4687e7a4c26976bde60cae21451')
})

const _ = require('lodash')
const path = require('path')


/**
 * 映射 d 文件夹下的文件为模块
 */
const mapDir = d => {

  // 获得当前文件夹下的所有的文件夹和文件
  const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory())

  return dirs
}


router.get('/gameList',async (ctx, next) => {
  ctx.body = mapDir(path.join(__dirname, '../public/games/'))
})

module.exports = router

