const router = require('koa-router')()
const fs = require('fs')

router.get('/data_analysis_fe/*',  async (ctx, next) => {
  await ctx.render('index.html')
})

module.exports = router
