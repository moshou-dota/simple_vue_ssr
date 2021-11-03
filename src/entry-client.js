// 当涉及到动态代码拆分时，webpack 提供了两个类似的技术。
// 第一种，也是推荐选择的方式是，使用符合 ECMAScript 提案 的 import() 语法 来实现动态导入。
// import() 调用会在内部用到 promises。如果在旧版本浏览器中（例如，IE 11）使用 import()，
// 记得使用一个 polyfill 库（例如 es6-promise 或 promise-polyfill），来 shim Promise。
import 'es6-promise/auto'
import { createApp } from "./app";

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  app.$mount('#app')
})