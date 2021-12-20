<template>
  <div id="app">
    <div class="travel-wrapper">
      <div class="travel-nav">
        <Navbar v-show="isShow"></Navbar>
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
export default class App extends Vue {
  public isShow = false;
}
</script>
<style lang='scss'>
* {
  margin: 0;
  padding: 0;
}
.travel-wrapper {
  width: 90vw;
  height: 96vh; // 100vh会出现滚动条
  margin-left: 5vw;
  overflow: hidden;
  .travel-nav {
    height: 10%;
  }
  .travel-content {
    height: 85%;
    background: white;
    margin-top: 4px;
    box-shadow: 0 0 10px lightgray;
  }
}
</style>
