<template>
  <div
    class="pic-boost"
    v-if="pictureBoostShow"
    @click="handleClick"
    @mousewheel.prevent="scroll"
  >
    <img
      :src="imgData"
      ref="chatImg"
      class="img"
      :style="{
        transform: 'translateX(-50%) translateY(-50%) scale(' + multiples + ')',
      }"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class PictureBoost extends Vue {
  @Prop() public pictureBoostShow: boolean = false;
  @Prop() public imgData: string = "";
  public multiples: number = 1.0;
  public handleClick() {
    this.$emit("picBoostClose");
  }
  // 滚轮滑动
  public scroll(e: any) {
    const direction = e.deltaY > 0 ? "down" : "up";
    console.log("滚轮滚动");
    if (direction === "up") {
      // 滑轮向上滚动
      if (this.multiples >= 2) return;
      this.multiples += 0.1;
    } else {
      // 滑轮向下滚动
      if (this.multiples <= 0.5) return;
      this.multiples -= 0.1;
    }
  }
}
</script>

<style lang="scss">
.pic-boost {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(200, 200, 200, 0.6);
  z-index: 1;
  .img {
    position: absolute;
    max-width: 500px;
    max-height: 600px;
    top: 50%;
    left: 50%;
    z-index: 2;
  }
}
</style>