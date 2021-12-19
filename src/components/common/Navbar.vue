<template>
  <div class="nav-wrapper">
    <el-menu default-active="1" mode="horizontal" class="nav-menu">
      <el-menu-item index="1">Home</el-menu-item>
      <el-menu-item index="2">Plan</el-menu-item>
      <el-menu-item index="3">Sight</el-menu-item>
      <el-menu-item index="4">Intercourse</el-menu-item>
      <el-menu-item index="5">Journal</el-menu-item>
      <el-menu-item index="6">Guide</el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
export default class Navbar extends Vue {
  activeIndex = 1
}
</script>

<style lang="scss" scoped>
.nav-wrapper {
  display: flex;
  justify-content: center;
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