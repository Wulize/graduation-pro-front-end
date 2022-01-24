<template>
  <div class="nav-wrapper">
    <el-menu :default-active="activeIndex" mode="horizontal" class="nav-menu" @select="toSelectedRoute">
      <el-menu-item index="/home">Home</el-menu-item>
      <el-menu-item index="/plan">Plan</el-menu-item>
      <el-menu-item index="/sight">Sight</el-menu-item>
      <el-menu-item index="/intercourse">Intercourse</el-menu-item>
      <el-menu-item index="/journal">Journal</el-menu-item>
      <el-menu-item index="/guide">Guide</el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
@Component
export default class Navbar extends Vue {
  public activeIndex: string = this.$route.path
  @Watch('$route')
  handleWatch(newVal: any) {
    this.activeIndex = newVal.path
  }
  public toSelectedRoute(index: string) {
    this.$router.push(index)
  }
}
</script>

<style lang="scss" scoped>
.nav-wrapper {
  display: flex;
  justify-content: center;
  width: 600px;
  height: 75px;
  border-radius: 30px;
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