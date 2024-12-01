<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script>
export default {
  name: "App"
}
</script>

<style>

#app {
  background: var(--app-background-color);
}

</style>
