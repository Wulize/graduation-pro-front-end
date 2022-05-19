<template>
  <div class="posChoose">
    <div class="mainpart">
      <div class="item">
        <p>起点：</p>
        <el-select v-model="startPosition" placeholder="请选择">
          <el-option
            v-for="item in startOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <p>终点：</p>
        <el-select v-model="destination" placeholder="请选择">
          <el-option
            v-for="item in destinationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="chooseContent" v-if="startPosition && destination">
        * 将以 {{ startPosition }} 为起点，{{ destination }} 为终点进行路径规划
      </div>
      <div class="confirmButton">
        <el-button type="primary" @click="handleClick">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class PositionChoose extends Vue {
  public startPosition: string = "";
  public destination: string = "";
  public startOptions: any[] = [
    {
      value: "厦门站",
      label: "厦门站",
    },
    {
      value: "厦门北站",
      label: "厦门北站",
    },
    {
      value: "高崎机场",
      label: "高崎机场",
    },
  ];
  public destinationOptions: any[] = [
    {
      value: "厦门站",
      label: "厦门站",
    },
    {
      value: "厦门北站",
      label: "厦门北站",
    },
    {
      value: "高崎机场",
      label: "高崎机场",
    },
  ];
  // 对用的经纬度信息
  public positionInfo: any[] = [
    {
      latitude: 118.074184,
      longitude: 24.635894,
      info: "厦门北站",
    },
    {
      latitude: 118.116,
      longitude: 24.467489,
      info: "厦门站",
    },
    {
      latitude: 118.13709,
      longitude: 24.539495,
      info: "高崎机场",
    },
  ];
  public handleClick() {
    if (!this.startPosition || !this.destination) {
      this.$message({
        showClose: true,
        message: "请先选择起点与终点信息",
        type: "warning",
      });
    }
    const start = this.positionInfo.find(
      (item) => item.info === this.startPosition
    );
    const destination = this.positionInfo.find(
      (item) => item.info === this.destination
    );
    console.log(start, destination);

    this.$emit("posChooseClose", {
      start,
      destination,
    });
  }
}
</script>

<style lang="scss">
.posChoose {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(200, 200, 200, 0.6);
  z-index: 1;
  .mainpart {
    position: absolute;
    border-radius: 1.5rem;
    background: rgb(255, 255, 255);
    width: 450px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .item {
      display: flex;
      align-items: center;
    }
    .confirmButton {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .chooseContent {
      display: flex;
      justify-content: left;
      font-size: 12px;
      color: red;
    }
  }
}
</style>