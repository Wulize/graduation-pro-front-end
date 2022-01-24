<template>
  <div class="guide-wrapper">
    <div class="scenic-choose">
      <el-steps :active="0" direction="vertical" class="step-style">
        <el-step
          v-for="(item, index) in scenicArr"
          :key="index"
          :title="`第${index + 1}天`"
          @click.native="handleStepClick(index + 1)"
        ></el-step>
      </el-steps>
      <div class="scenic-detail">
        <p>第{{ active }}天的游览景点推荐</p>
        <div class="scenic-introduce">
          <div
            class="detail-item"
            v-for="(item, index) in scenicArr[active - 1]"
            :key="index"
          >
            <div class="item-name">{{ item.content }}</div>
            <div class="item-introduction">
              景点介绍: {{ item.description }}
            </div>
            <div class="food-introduction">
              附近美食: {{ item.description }}
            </div>
          </div>
        </div>
        <div class="generate-button">
          <el-button type="primary" @click="generateMap"
            >生成可视化路线</el-button
          >
        </div>
      </div>
    </div>
    <div class="map-generate">
      <div class="route-info">
        <p class="info-title">路线推荐结果</p>
        <div class="info-detail">
          <div class="route-detail">
            <p
              v-for="(item, index) in dailyScenic"
              :key="index"
              title="点击查看具体信息"
              @click="chooseRoute(index)"
            >
              {{
                `${
                  index !== dailyScenic.length - 1
                    ? `● ${item.content}--->${dailyScenic[index + 1].content}`
                    : "入住XXXXXXXXX酒店"
                }  `
              }}
            </p>
          </div>
          <div class="trip-mode">
            <p>
              {{
                `已选择路段:   ${origin.content || "起点"} ---> ${
                  destination.content || "终点"
                }`
              }}
            </p>
            <div class="mode-choose">
              <el-button @click="generateModeInfo(1)">步行</el-button>
              <el-button @click="generateModeInfo(2)">公交</el-button>
              <el-button @click="generateModeInfo(3)">出租车</el-button>
            </div>
            <div class="mode-detail">
              <div class="detail-item">
                <p>距离:</p>
                <p>{{ modeItemInfo.distance }}m</p>
              </div>
              <div class="detail-item">
                <p>用时:</p>
                <p>{{ modeItemInfo.time }}s</p>
              </div>
              <div class="detail-item">
                <p>费用:</p>
                <p>{{ modeItemInfo.cost }}元</p>
              </div>
              <div class="detail-item">
                <p>工具(默认时间最短):</p>
                <p>{{ modeItemInfo.mode }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="map-wrap">
        <amap
          cache-key="home-map"
          map-style="amap://styles/whitesmoke"
          :zoom="12"
          resizeEnable="true"
          :center="[118.129625, 24.479833]"
        >
          <amap-marker
            v-for="(item, index) in scenicArr[active - 1]"
            :key="index"
            :position="item.position"
            :label="{
              content: `${item.content}`,
              direction: 'bottom',
            }"
          />
          <amap-polyline
            :editable="editable"
            :path.sync="path"
            :stroke-weight="8"
          ></amap-polyline>
        </amap>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios from "axios";
import * as _ from "lodash";
@Component
export default class Guide extends Vue {
  public userName: string = sessionStorage.getItem("userName") || "";
  // 出行方式的信息
  public modeItemInfo: any = {
    distance: 0,
    time: 0,
    cost: 0,
    mode: "暂无选择",
  };
  public origin: any = {};
  public destination: any = {};
  public path: any = [];
  public editable: boolean = true;
  //  算法返回的当天旅游建议
  public dailyScenic: any = [
    {
      content: "厦门大学",
      position: [118.108354, 24.44184],
      description:
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
    {
      content: "胡里山炮台",
      position: [118.112612, 24.435458],
      description:
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
    {
      content: "五缘湾公园",
      position: [118.181566, 24.520184],
      description:
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
    {
      content: "观音山",
      position: [118.195137, 24.499667],
      description:
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
  ];
  public active: number = 1;
  public scenicArr: any = [
    [
      {
        content: "厦门大学",
        position: [118.108354, 24.44184],
        description:
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      {
        content: "胡里山炮台",
        position: [118.112612, 24.435458],
        description:
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      {
        content: "五缘湾公园",
        position: [118.181566, 24.520184],
        description:
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      {
        content: "观音山",
        position: [118.195137, 24.499667],
        description:
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    ],
    [
      {
        content: "观音山",
        position: [118.195137, 24.499667],
        description:
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      {
        content: "海湾公园",
        position: [118.082752, 24.479148],
        description:
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      {
        content: "曾厝安",
        position: [118.133057, 24.432768],
        description:
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    ],
    [
      {
        content: "植物园",
        position: [118.116583, 24.453247],
        description:
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      {
        content: "白城沙滩",
        position: [118.10927, 24.43795],
        description:
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    ],
  ];

  // 步进器的点击事件
  public handleStepClick(index: number) {
    this.active = index;
  }
  // 点击进行路径规划,规划结束之后在地图上画出路线
  public generateMap() {
    const scenics = _.cloneDeep(this.scenicArr[this.active - 1]);
    const type: string = "driving";
    const origin = scenics.shift().position.join(",");
    const destination = scenics.pop().position.join(",");
    let waypoints = "";
    scenics.forEach((element: any, index: number) => {
      waypoints +=
        index === scenics.length - 1
          ? element.position.join(",")
          : element.position.join(",") + ";";
    });
    this.getGaodeRoute(type, origin, destination, waypoints);
  }
  // 获取两点之间的路线图
  public getGaodeRoute(
    type: string,
    origin: string,
    destination: string,
    waypoints: string
  ) {
    let params = {};
    const key = "e422be5c1c55afc3ca294dee1d3db842";
    if (type === "driving") {
      params = {
        key,
        origin,
        destination,
        waypoints,
      };
    } else if (type === "walking") {
      params = { key, origin, destination };
    } else {
      params = { key, origin, destination, city: "厦门", strategy: 5 };
    }
    axios
      .get("https://restapi.amap.com/v3/direction/" + type, {
        params,
      })
      .then((res: any) => {
        // 非公交车
        this.path = [];
        if (type !== "transit/integrated") {
          this.modeItemInfo.distance = res.data.route.paths[0].distance || 0;
          this.modeItemInfo.time = res.data.route.paths[0].duration || 0;
          this.modeItemInfo.cost = res.data.route.taxi_cost || 0;
          this.modeItemInfo.mode = "目前仅提供公交信息";

          const route = res.data.route.paths[0].steps;
          route.forEach((element: any) => {
            let polylineItem = [];
            element.polyline.split(";").forEach((item: any) => {
              polylineItem = item.split(",");
              polylineItem[0] = Number(polylineItem[0]);
              polylineItem[1] = Number(polylineItem[1]);
              this.path.push(polylineItem);
            });
          });
        } else {
          // this.modeItemInfo.distance = res.data.route.paths[0].distance || 0;
          // this.modeItemInfo.time = res.data.route.paths[0].duration || 0;
          this.modeItemInfo.cost = res.data.route.transits[0].cost || 0;
          const route = res.data.route.transits;
          this.modeItemInfo.mode = "步行";
          this.modeItemInfo.distance = route[0].distance;
          this.modeItemInfo.time = route[0].duration;
          this.modeItemInfo.mode += `->${route[0].segments[0].bus.buslines[0].name}`;
          route[0].segments[0].bus.buslines[0].polyline
            .split(";")
            .forEach((part: any) => {
              let polylineItem = [];
              polylineItem = part.split(",");
              polylineItem[0] = Number(polylineItem[0]);
              polylineItem[1] = Number(polylineItem[1]);
              this.path.push(polylineItem);
            });
        }
      });
  }

  // 选择推荐路段生成推荐信息
  public chooseRoute(index: number) {
    if (index !== this.dailyScenic.length - 1) {
      this.origin = this.dailyScenic[index];
      this.destination = this.dailyScenic[index + 1];
    }
  }

  // 生成两个景点之间的不同出行方式信息
  public generateModeInfo(index: number) {
    if (!this.origin.position) {
      this.$message({
        showClose: true,
        message: "请选择一个路段！",
        type: "warning",
      });
      return;
    }
    // 步行
    if (index === 1) {
      const type: string = "walking";
      this.getGaodeRoute(
        type,
        this.origin.position.join(","),
        this.destination.position.join(","),
        ""
      );
    } else if (index === 2) {
      const type: string = "transit/integrated";
      this.getGaodeRoute(
        type,
        this.origin.position.join(","),
        this.destination.position.join(","),
        "厦门"
      );
    } else {
      const type: string = "driving";
      this.getGaodeRoute(
        type,
        this.origin.position.join(","),
        this.destination.position.join(","),
        ""
      );
    }
  }
}
</script>

<style lang="scss">
.guide-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 90px;
  background-image: url("../assets/images/home/home01.jpg");
  background-size: 100%;
  .scenic-choose {
    width: 100%;
    height: 27rem;
    display: flex;
    margin-bottom: 1rem;
    .el-steps--vertical {
      margin-left: 2rem;
    }
    .step-style {
      .el-step__title.is-wait {
        color: black;
      }
      .el-step__title.is-process {
        font-weight: 500;
      }
      .el-step__head.is-wait {
        color: black;
        border-color: black;
      }
      .el-step__line {
        background-color: #565656;
      }
    }
    .scenic-detail {
      width: 80%;
      margin-left: 5rem;
      background: rgb(228, 224, 224);
      box-shadow: 0px 0px 10px 5px #aaa;
      p {
        width: 100%;
        text-align: center;
      }
      .generate-button {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
        .el-button--primary {
          color: #fff;
          background-color: #a6a6a6;
          border-color: #a6a6a6;
        }
      }
      .scenic-introduce {
        width: 100%;
        height: 20rem;
        display: flex;
        .detail-item {
          flex-grow: 1;
          flex-shrink: 1;
          margin-left: 0.8rem;
          margin-right: 0.8rem;
          width: 350px;
          word-break: break-all;
          .item-introduction {
            margin-bottom: 1rem;
          }
          .item-name {
            text-align: center;
            margin-bottom: 2rem;
          }
        }
      }
    }
  }
  .map-generate {
    display: flex;
    width: 94%;
    background: white;
    margin: 3% 4% 0 2%;
    margin-bottom: 2rem;
    box-shadow: 0px 0px 10px 5px #aaa;
    .route-info {
      width: 50%;
      .info-title {
        width: 100%;
        text-align: center;
      }
      .info-detail {
        display: flex;
        width: 100%;
        height: 80%;
        padding-left: 1%;
        .route-detail {
          height: 100%;
          width: 40%;
          display: flex;
          flex-direction: column;
          p {
            cursor: pointer;
            margin-bottom: auto;
          }
        }
        .trip-mode {
          width: 60%;
          height: 100%;
          p {
            text-align: center;
          }
          .mode-choose {
            display: flex;
            justify-content: flex-start;
            .el-button {
              margin-right: auto;
            }
          }
          .mode-detail {
            display: flex;
            flex-direction: column;
            width: 90%;
            .detail-item {
              display: flex;
              p {
                width: 50%;
                text-align: start;
              }
            }
          }
        }
      }
    }
    .map-wrap {
      width: 50%;
      height: 500px;
    }
  }
}
</style>