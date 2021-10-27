
const CreateApp = require('./app.js')
const server = require('express')()
const Template = require('fs').readFileSync('./index.template.html', 'utf-8')
const renderer = require('vue-server-renderer').createRenderer({
  template: Template
})

server.get('*', (req, res) => {
  const app = CreateApp({url: req.url})

  const context = {
    title: 'hello',
    meta: `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    `
  }

  renderer.renderToString(app, context, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

server.listen(8080)