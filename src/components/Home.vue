<template>
  <div>
    <div>Home</div>
    <p>id: {{ item.id }}</p>
    <p>name: {{ item.name }}</p>
  </div>
</template>

<script>
export default {
  asyncData({store, route}) {
    return store.dispatch("fetchItem", route.query.id);
  },
  computed: {
    item() {
      return this.$store.state.item;
    },
  },
};
</script>

<style></style>
