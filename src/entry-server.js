import { createApp } from "./app";

export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();
    router.push(context.url);
    router.onReady(() => {
      const matchComponents = router.getMatchedComponents();
      if (!matchComponents.length) {
        return reject({ code: 404, url: context.url });
      }
      const matchAsyncData = matchComponents.filter(component => component.asyncData).map(component => {
        if (component.asyncData) {
          return component.asyncData({store, route: router.currentRoute})
        }
      })
      return Promise.all(matchAsyncData).then(() => {
        context.state = store.state
        return resolve(app);
      }, reject)
    }, reject);
  });
};
