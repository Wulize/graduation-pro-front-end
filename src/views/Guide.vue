<template>
  <div class="guide-wrapper">
    <div class="scenic-choose">
      <el-steps :active="0" direction="vertical" class="step-style">
        <el-step
          v-for="(item, index) in scenicArr"
          :key="index"
          :title="`第 ${index + 1} 天`"
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
              {{ item.description }}
            </div>
            <div class="food-introduction">
              附近美食: 四果汤，土笋冻，蚵仔煎
            </div>
          </div>
        </div>
        <div class="generate-button">
          <el-button type="success" @click="generateMap"
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
      <div class="map-wrap" ref="mapId">
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
            v-show="path.length !== 0"
            :editable="editable"
            :path.sync="path"
            :stroke-weight="4"
          ></amap-polyline>
        </amap>
      </div>
    </div>
    <PositionChoose
      v-if="choiceShow"
      @posChooseClose="handlePositionChoose"
    ></PositionChoose>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import axios from "axios";
import * as _ from "lodash";
import PositionChoose from "../components/Guide/position-choose.vue";
@Component({
  components: { PositionChoose },
})
export default class Guide extends Vue {
  //  他市用户选择的路径规划起点、终点
  public start: any = {
    latitude: "",
    longitude: "",
    info: "",
  };
  public desti: any = {
    latitude: "",
    longitude: "",
    info: "",
  };
  // 本市用户当前用户的经纬度
  public position: any = {
    latitude: "",
    longitude: "",
    city: "",
  };
  // 用户定位不在厦门市时，展示用户起点终点选择界面
  public choiceShow: boolean = false;
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
  public path: any[] = [[118.108354, 24.44184]];
  public editable: boolean = true;
  //  算法返回的当天旅游建议
  public dailyScenic: any = [
    {
      content: "厦门大学",
      position: [118.108354, 24.44184],
      description:
        "上弦场是厦大出镜率最高的体育场,也是校园中最适合感受大学时光的地方。操场与海一街之隔,宽阔的区域不仅能一眼望到厦门最高的建筑双子塔(世茂海峡大厦),坐在倾斜的看台上还能与标志性的建南大礼堂合影留念。 林若萌 这座礼堂承载着厦大学子的毕业典礼,也同样是一座中西合璧的气派建筑。",
    },
    {
      content: "胡里山炮台",
      position: [118.106383, 24.429475],
      description:
        "胡里山炮台（胡里山礮台）位于中国福建省厦门市厦门岛东南海岬突出部，毗邻厦门大学园区，三面环海，景区系国家级文物保护单位、全国4A级旅游景区。",
    },
    {
      content: "五缘湾公园",
      position: [118.178726, 24.516443],
      description:
        "厦门五缘湾湿地公园是厦门五缘湾片区带动项目之一，占地85公顷，面积相当于半个鼓浪屿，是厦门最大的公园，也是最大的湿地生态园区，被称为是厦门的城市绿肺。",
    },
    {
      content: "观音山",
      position: [118.198951, 24.497438],
      description:
        "观音山海岸线上有很美的海滨浴场，来这里的游客一定要到干净的浴场上好好的尽兴一番，晒晒太阳玩玩水。主要景点 厦门观音山海滨旅游项目用地位于厦门东部，紧临环岛路，面向厦门东海域，与金门隔海相望",
    },
  ];
  public active: number = 1;
  public scenicArr: any = [
    [
      {
        content: "厦门大学",
        position: [118.108354, 24.44184],
        description:
          "上弦场是厦大出镜率最高的体育场,也是校园中最适合感受大学时光的地方。操场与海一街之隔,宽阔的区域不仅能一眼望到厦门最高的建筑双子塔(世茂海峡大厦),坐在倾斜的看台上还能与标志性的建南大礼堂合影留念。 林若萌 这座礼堂承载着厦大学子的毕业典礼,也同样是一座中西合璧的气派建筑。",
      },
      {
        content: "胡里山炮台",
        position: [118.106383, 24.429475],
        description:
          "胡里山炮台（胡里山礮台）位于中国福建省厦门市厦门岛东南海岬突出部，毗邻厦门大学园区，三面环海，景区系国家级文物保护单位、全国4A级旅游景区。",
      },
      {
        content: "观音山",
        position: [118.198951, 24.497438],
        description:
          "观音山海岸线上有很美的海滨浴场，来这里的游客一定要到干净的浴场上好好的尽兴一番，晒晒太阳玩玩水。主要景点 厦门观音山海滨旅游项目用地位于厦门东部，紧临环岛路，面向厦门东海域，与金门隔海相望",
      },
      {
        content: "五缘湾公园",
        position: [118.178726, 24.516443],
        description:
          "厦门五缘湾湿地公园是厦门五缘湾片区带动项目之一，占地85公顷，面积相当于半个鼓浪屿，是厦门最大的公园，也是最大的湿地生态园区，被称为是厦门的城市绿肺。",
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
    (this.$refs.mapId as any).scrollIntoView(false);
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

  // 获取用户定位
  public getPosition() {
    const self = this;
    const geolocation = new (AMap as any).Geolocation({
      // 是否使用高精度定位，默认：true
      enableHighAccuracy: true,
      // 设置定位超时时间，默认：无穷大
      timeout: 10000,
    });
    geolocation.getCurrentPosition(onComplete, onError);
    function onComplete(status: string, result: any) {
      // data是具体的定位信息
      self.position.latitude = result.position.lat;
      self.position.longitude = result.position.lng;
      self.position.city = "厦门";
    }

    function onError(data: any) {
      // 定位出错
      self.$message({
        showClose: true,
        message: "定位出错。",
        type: "warning",
      });
    }
  }

  // mounted 钩子
  public mounted() {
    const params = { key: "e422be5c1c55afc3ca294dee1d3db842" };
    axios
      .get("https://restapi.amap.com/v3/ip", {
        params,
      })
      .then((res: any) => {
        if (res.data.city === "厦门市") {
          this.$message({
            showClose: true,
            message: "当前定位为厦门境内,以当前定位地址进行路径规划。",
            type: "info",
          });
          setTimeout(() => {
            this.getPosition();
          }, 2500);
        } else {
          this.choiceShow = true;
        }
      });
  }
  // 处理厦门市外用户选择起点终点的方法
  public handlePositionChoose(args: any) {
    this.start = args.start;
    this.desti = args.destination;
    this.choiceShow = false;
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
    height: 29rem;
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
        margin-bottom: 2rem;
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
            margin-bottom: 1rem;
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