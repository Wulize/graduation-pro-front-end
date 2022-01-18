<template>
  <div class="guide-wrapper">
    <div class="scenic-choose">
      <p>我的景点推荐</p>
    </div>
    <div class="map-generate">
      <amap
        cache-key="home-map"
        map-style="amap://styles/whitesmoke"
        :zoom="15"
        :center="[121.5389385, 31.21515044]"
      >
        <amap-marker
          :position="[121.5389385, 31.21515044]"
          :label="{
            content: '起点',
            direction: 'bottom',
          }"
        />
        <amap-marker
          :position="[121.5273285, 31.21515044]"
          :label="{
            content: '终点',
            direction: 'bottom',
          }"
        />
        <amap-polyline
          :editable="polyline.editable"
          :path="polyline.path"
        ></amap-polyline>
      </amap>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class Guide extends Vue {
  public userName: string = sessionStorage.getItem("userName") || "";
  public polyline: any = {
    path: [
      [121.5389385, 31.21515044],
      [121.5273285, 31.21515044],
    ],
    editable: false,
  };
}
</script>

<style lang="scss">
.guide-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 90px;
  background-image: url("../assets/images/home/home01.jpg");
  background-size: 100%;
  .scenic-choose {
    width: 100%;
    height: 41vh;
  }
  .map-generate {
    width: 100%;
    height: 50vh;
  }
}
</style>