<template>
  <div id="app">
    <div>访问的 URL 是：{{ url }}</div>
    <div>{{ val }}</div>
    <router-link to="/">Home</router-link>
    <router-link to="/foo">Foo</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: this.$route.path,
      val: 22,
    }
  },
  // beforeCreate () { // 将数据进行响应式的过程在服务器上是多余的，所以默认情况下禁用。
  //   console.log('1111')
  //   this.val = 12
  // },
  mounted() {
    console.log('1111')
    this.val = 12
  },
}
</script>

<style lang="scss">
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  div:first-child {
    line-height: 48px;
    font-weight: bold;
  }
}
</style>
<style>
@custom-media --viewport-medium (width <= 50rem);
@custom-selector :--heading h1, h2, h3, h4, h5, h6;

:root {
  --fontSize: 1rem;
  --mainColor: #12345678;
  --secondaryColor: lab(32.5 38.5 -47.6 / 90%);
}

html {
  overflow: hidden auto;
}

@media (--viewport-medium) {
  body {
    color: var(--mainColor);
    font-family: system-ui;
    font-size: var(--fontSize);
    line-height: calc(var(--fontSize) * 1.5);
    overflow-wrap: break-word;
    padding-inline: calc(var(--fontSize) / 2 + 1px);
  }
}

:--heading {
  margin-block: 0;
}

.hero:matches(main, .main) {
  /* background-image: image-set('img/background.jpg' 1x, 'img/background-2x.jpg' 2x); */
  background-color: red;
}

a {
  color: rgb(0 0 100% / 90%);

  &:hover {
    color: rebeccapurple;
  }
}
</style>
