const path = require('path')
const express = require('express');
const server = express();
const { createBundleRenderer } = require("vue-server-renderer");
const serverBundle = require(path.resolve(
  process.cwd(),
  "dist",
  "vue-ssr-server-bundle.json"
));
const clientManifest = require(path.resolve(
  process.cwd(),
  "dist",
  "vue-ssr-client-manifest.json"
));
const template = require('fs').readFileSync('./index.template.html', 'utf-8')
const renderer = createBundleRenderer(serverBundle, {
  template,
  clientManifest
})

server.use(express.static(path.resolve(process.cwd(), "dist")));

server.get('*', (req, res) => {
  const context = { url: req.url, title: 'vue ssr demo' }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.error("有一个错误", err);
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Internal Server Error')
      }
    } else {
      res.end(html)
    }
  })
})

server.listen(8080)

process.on("uncaughtException", (err) => {
  console.error("有一个未捕获的错误", err);
  process.exit(1); //强制性的（根据 Node.js 文档）
});