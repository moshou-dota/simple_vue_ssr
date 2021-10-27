<template>
  <div id="app">
    <div>访问的 URL 是：{{ url }}</div>
    <div>{{val}}</div>
    <router-link to="/">Home</router-link>
    <router-link to="/foo">Foo</router-link>
    <router-view/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: this.$route.path,
      val: 22
    }
  },
  beforeCreate () {
    console.log('1111')
    this.val = 12
  }
  // mounted () {
  //   console.log('1111')
  //   this.url = this.$route.path
  // }
}
</script>

<style>

</style>
