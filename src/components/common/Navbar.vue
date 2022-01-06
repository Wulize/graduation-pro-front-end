<template>
  <div class="nav-wrapper">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      class="nav-menu"
      @select="toSelectedRoute"
    >
      <el-menu-item index="/home">首页</el-menu-item>
      <el-menu-item index="/plan">计划</el-menu-item>
      <el-menu-item index="/sight">景点</el-menu-item>
      <el-menu-item index="/intercourse">交友</el-menu-item>
      <el-menu-item index="/journal">游记</el-menu-item>
      <el-menu-item index="/guide">导游</el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class Navbar extends Vue {
  public activeIndex: string = this.$route.path;
  @Watch("$route")
  handleWatch(newVal: any) {
    this.activeIndex = newVal.path;
    if (newVal.path === "/intercourse") {
      this.$store.state.showNav = false;
    } else {
      this.$store.state.showNav = true;
    }
  }
  public toSelectedRoute(index: string) {
    this.$router.push(index);
  }
}
</script>

<style lang="scss" scoped>
.nav-wrapper {
  display: flex;
  justify-content: center;
  width: 600px;
  height: 75px;
  .nav-menu {
    color: lightgray;
    background: none !important;
    border-bottom: none !important;
    .el-menu-item {
      background: none !important;
      font-size: 18px;
    }
    .el-menu-item.is-active {
      border-bottom: 4px solid;
      border-bottom-color: rgba($color: blue, $alpha: 0.4);
    }
    .el-menu-item:hover {
      color: rgba($color: #000000, $alpha: 0.4) !important;
    }
    .el-menu-item:focus {
      color: rgba($color: blue, $alpha: 0.4) !important;
      border-bottom: 4px solid;
      border-bottom-color: rgba($color: blue, $alpha: 0.4);
    }
  }
}
</style>