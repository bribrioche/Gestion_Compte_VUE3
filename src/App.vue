<template>
  <v-app id="app">
    <Header v-if="showHeader" />
    <router-view></router-view>
  </v-app>
</template>

<script>
import Header from "./components/Header.vue";
export default {
  name: "App",
  components: {
    Header,
  },
  computed: {
    showHeader() {
      return this.$route.meta.showHeader !== false;
    },
  },
};
</script>

<style>
@import url("./styles/reset.css");
@import url("https://fonts.googleapis.com/css2?family=Roboto%3Awght%40300%3B400%3B700&display=swap");
@import url("https://cdn.jsdelivr.net/npm/vuetify@3.3.22/dist/vuetify-labs.css");

#app {
  font-family: "Roboto", sans-serif;
}
</style>
