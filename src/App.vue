<template>
  <div id="app">
    <div class="travel-wrapper">
      <div class="travel-nav">
        <Navbar v-if="$store.state.showNav"></Navbar>
      </div>
      <div class="travel-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Navbar from "./components/common/Navbar.vue";
@Component({
  components: {
    Navbar,
  },
})
export default class App extends Vue {}
</script>
<style lang='scss'>
body {
  margin: 0;
  padding: 0;
}
iframe {
  display: none;
}
.travel-wrapper {
  width: 100vw;
  height: 100vh;
  .travel-nav {
    position: fixed;
    left: calc(50% - 300px);
    top: 0;
    z-index: 999;
  }
  .travel-content {
    width: 100%;
    height: 100%;
    min-width: 800px;
  }
}
</style>
