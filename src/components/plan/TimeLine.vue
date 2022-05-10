<template>
  <div class="time-line-wrapper">
    <el-steps :active="activeIndex" align-center>
      <el-step v-for="time,index in step" :key='index' :title='time' @click.native="toCertainDay(index)"></el-step>
    </el-steps>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({
  components: {},
})
export default class extends Vue {
  public step: string[] = ['第一天', '第二天', '第三天', '第四天'] // 步骤条时间
  public activeIndex: number = 1 // 当前选择的是第几天

  public toCertainDay(index: number): void {
    this.activeIndex = index + 1
    console.log(this.activeIndex)
  }
}
</script>

<style lang="scss" scoped>
.time-line-wrapper {
  width: 50%;
  .el-steps {
    /deep/ .el-step {
      cursor: pointer;
      .el-step__head.is-finish {
        color: green;
        border-color: green;
      }
      .el-step__title.is-finish {
        color: green;
      }
      .el-step__head.is-process {
        color: lightgreen;
        border-color: lightgreen;
      }
      .el-step__title.is-process {
        color: lightgreen;
      }
    }
    /deep/ .el-step__icon:hover {
      transform: scale(1.5);
    }
  }
}
</style>