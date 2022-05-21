<template>
  <div class="guide-wrapper">
    <div class="scenic-choose">
      <el-steps :active="0" direction="vertical" class="step-style">
        <el-step v-for="(item, index) in scenicArr" :key="index" :title="`第 ${index + 1} 天`" @click.native="handleStepClick(index + 1)"></el-step>
      </el-steps>
      <div class="scenic-detail">
        <p>第{{ active }}天的游览景点推荐</p>
        <div class="scenic-introduce">
          <div class="detail-item" v-for="(item, index) in scenicArr[active - 1]" :key="index">
            <div class="item-name">
              {{ (item || {}).content || "无" }}
            </div>
            <div class="item-introduction" style="
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 10;
              ">
              {{ (item || {}).description || "暂无相关介绍" }}
            </div>
            <!-- <div class="food-introduction">
              附近美食: 四果汤，土笋冻，蚵仔煎
            </div> -->
          </div>
        </div>
        <div class="generate-button">
          <el-button type="success" @click="generateMap">生成可视化路线</el-button>
        </div>
      </div>
    </div>
    <div class="map-generate">
      <div class="route-info">
        <p class="info-title">路线推荐结果</p>
        <div class="info-detail">
          <div class="route-detail">
            <p v-for="(item, index) in dailyScenic" :key="index" title="点击查看具体信息" @click="chooseRoute(index)">
              {{
                `${
                  index !== dailyScenic.length - 1
                    ? `● ${(item || {}).content || "暂无"}--->${
                        (dailyScenic[index + 1] || {}).content || "暂无"
                      }`
                    : "入住XXXXXXXXX酒店"
                }  `
              }}
            </p>
          </div>
          <div class="trip-mode">
            <p>
              {{
                `已选择路段:   ${(origin || {}).content || "起点"} ---> ${
                  (destination || {}).content || "终点"
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
        <amap cache-key="home-map" map-style="amap://styles/whitesmoke" :zoom="12" resizeEnable="true" :center="[118.129625, 24.479833]">
          <amap-marker v-for="(item, index) in dailyScenic" :key="index" :position="item.position" :label="{
              content: `${(item || {}).content || '暂无'}`,
              direction: 'bottom',
            }" />
          <amap-polyline v-show="path.length !== 0" :editable="editable" :path.sync="path" :stroke-weight="4"></amap-polyline>
        </amap>
      </div>
    </div>
    <PositionChoose v-if="choiceShow" @posChooseClose="handlePositionChoose"></PositionChoose>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import axios from 'axios'
import * as _ from 'lodash'
import PositionChoose from '../components/Guide/position-choose.vue'
@Component({
  components: { PositionChoose },
})
export default class Guide extends Vue {
  //  他市用户选择的路径规划起点、终点
  public start: any = {
    latitude: '',
    longitude: '',
    info: '',
  }
  public desti: any = {
    latitude: '',
    longitude: '',
    info: '',
  }
  // 本市用户当前用户的经纬度
  public position: any = new Array(2)
  // 用户定位不在厦门市时，展示用户起点终点选择界面
  public choiceShow: boolean = false
  public userName: string = sessionStorage.getItem('userName') || ''
  // 出行方式的信息
  public modeItemInfo: any = {
    distance: 0,
    time: 0,
    cost: 0,
    mode: '暂无选择',
  }
  public origin: any = {}
  public destination: any = {}
  public path: any[] = [[118.108354, 24.44184]]
  public editable: boolean = true
  //  算法返回的当天旅游建议
  public dailyScenic: any[] = []
  public active: number = 1
  public scenicArr: any[] = []

  // 步进器的点击事件
  public handleStepClick(index: number) {
    this.active = index
    this.dailyScenic = this.scenicArr[index - 1]
    console.log(this.$store.state.sightList)

    console.log(this.scenicArr[index - 1])
  }
  // 点击进行路径规划,规划结束之后在地图上画出路线
  public generateMap() {
    ;(this.$refs.mapId as any).scrollIntoView(false)
    const scenics = _.cloneDeep(this.scenicArr[this.active - 1])
    const type: string = 'driving'
    const origin = scenics.shift().position.join(',')
    const destination = scenics.pop().position.join(',')
    let waypoints = ''
    scenics.forEach((element: any, index: number) => {
      waypoints +=
        index === scenics.length - 1
          ? element.position.join(',')
          : element.position.join(',') + ';'
    })
    this.getGaodeRoute(type, origin, destination, waypoints)
  }
  // 获取两点之间的路线图
  public getGaodeRoute(
    type: string,
    origin: string,
    destination: string,
    waypoints: string
  ) {
    let params = {}
    const key = 'e422be5c1c55afc3ca294dee1d3db842'
    if (type === 'driving') {
      params = {
        key,
        origin,
        destination,
        waypoints,
      }
    } else if (type === 'walking') {
      params = { key, origin, destination }
    } else {
      params = { key, origin, destination, city: '厦门', strategy: 5 }
    }
    axios
      .get('https://restapi.amap.com/v3/direction/' + type, {
        params,
      })
      .then((res: any) => {
        // 非公交车
        this.path = []
        if (type !== 'transit/integrated') {
          this.modeItemInfo.distance = res.data.route.paths[0].distance || 0
          this.modeItemInfo.time = res.data.route.paths[0].duration || 0
          this.modeItemInfo.cost = res.data.route.taxi_cost || 0
          this.modeItemInfo.mode = '目前仅提供公交信息'

          const route = res.data.route.paths[0].steps
          route.forEach((element: any) => {
            let polylineItem = []
            element.polyline.split(';').forEach((item: any) => {
              polylineItem = item.split(',')
              polylineItem[0] = Number(polylineItem[0])
              polylineItem[1] = Number(polylineItem[1])
              this.path.push(polylineItem)
            })
          })
        } else {
          // this.modeItemInfo.distance = res.data.route.paths[0].distance || 0;
          // this.modeItemInfo.time = res.data.route.paths[0].duration || 0;
          this.modeItemInfo.cost = res.data.route.transits[0].cost || 0
          const route = res.data.route.transits
          this.modeItemInfo.mode = '步行'
          this.modeItemInfo.distance = route[0].distance
          this.modeItemInfo.time = route[0].duration
          this.modeItemInfo.mode += `->${route[0].segments[0].bus.buslines[0].name}`
          route[0].segments[0].bus.buslines[0].polyline
            .split(';')
            .forEach((part: any) => {
              let polylineItem = []
              polylineItem = part.split(',')
              polylineItem[0] = Number(polylineItem[0])
              polylineItem[1] = Number(polylineItem[1])
              this.path.push(polylineItem)
            })
        }
      })
  }

  // 选择推荐路段生成推荐信息
  public chooseRoute(index: number) {
    if (index !== this.dailyScenic.length - 1) {
      this.origin = this.dailyScenic[index]
      this.destination = this.dailyScenic[index + 1]
    }
  }

  // 生成两个景点之间的不同出行方式信息
  public generateModeInfo(index: number) {
    if (!this.origin.position) {
      this.$message({
        showClose: true,
        message: '请选择一个路段！',
        type: 'warning',
      })
      return
    }
    // 步行
    if (index === 1) {
      const type: string = 'walking'
      this.getGaodeRoute(
        type,
        this.origin.position.join(','),
        this.destination.position.join(','),
        ''
      )
    } else if (index === 2) {
      const type: string = 'transit/integrated'
      this.getGaodeRoute(
        type,
        this.origin.position.join(','),
        this.destination.position.join(','),
        '厦门'
      )
    } else {
      const type: string = 'driving'
      this.getGaodeRoute(
        type,
        this.origin.position.join(','),
        this.destination.position.join(','),
        ''
      )
    }
  }

  // 获取用户定位
  public getPosition(res: any) {
    const loading = this.$loading({
      lock: true,
      text: '正在根据你的当前定位进行合理路径推荐，请稍后！',
      spinner: 'el-icon-loading',
      background: 'rgba(0,0,0,0.7)',
    })
    const self = this
    const geolocation = new (AMap as any).Geolocation({
      // 是否使用高精度定位，默认：true
      enableHighAccuracy: true,
      // 设置定位超时时间，默认：无穷大
      timeout: 10000,
    })
    geolocation.getCurrentPosition(onComplete, onError)
    function onComplete(status: string, result: any) {
      // data是具体的定位信息
      self.position[1] = 24.436343
      self.position[0] = 118.102576
      console.log('用户当前定位信息： ', self.position)
      res[0] = { lng: self.position[0], lat: self.position[1] }
      ;(self as any).$http
        .get('/path/recommend', {
          sightList: JSON.stringify(res),
          isTsp: false,
        })
        .then((response: any) => {
          console.log(response)
          const sightArr = response.bestRouter.slice(1)
          let arr = new Array(),
            num = 1
          for (const value of sightArr) {
            if (num % 5 === 0) {
              console.log('list1', arr)
              self.scenicArr.push(arr)
              arr = new Array()
              num = 1
            }
            num++
            arr.push(self.$store.state.sightList[value - 1])
          }
          if (arr.length) self.scenicArr.push(arr)
          console.log('景点：', self.scenicArr)

          self.dailyScenic = self.scenicArr[0]

          console.log('景点列表', self.$store.state.sightList)
          loading.close()
        })
    }

    function onError(data: any) {
      // 定位出错
      self.$message({
        showClose: true,
        message: '定位出错。',
        type: 'warning',
      })
    }
  }

  // mounted 钩子
  public mounted() {
    const params = { key: 'e422be5c1c55afc3ca294dee1d3db842' }
    axios
      .get('https://restapi.amap.com/v3/ip', {
        params,
      })
      .then((res: any) => {
        if (res.data.city === '厦门市') {
          this.$message({
            showClose: true,
            message: '当前定位为厦门境内,以当前定位地址进行路径规划。',
            type: 'info',
          })
          // settimeout是为了加载地图组件，避免报错undefined
          setTimeout(() => {
            const args: any = {}
            let key = 1
            for (const value of this.$store.state.sightList) {
              const item = { lng: value.position[0], lat: value.position[1] }
              args[key] = item
              key++
            }
            this.getPosition(args)
          }, 2000)
        } else {
          this.choiceShow = true
        }
      })
    // console.log("路径推荐：", this.$store.state.sightList);
  }
  // 处理厦门市外用户选择起点终点的方法
  public handlePositionChoose(args: any) {
    this.start = args.start
    this.desti = args.destination
    this.choiceShow = false
    const loading = this.$loading({
      lock: true,
      text: '正在根据你的当前定位进行合理路径推荐，请稍后！',
      spinner: 'el-icon-loading',
      background: 'rgba(0,0,0,0.7)',
    })
    // 起点终点是否一样
    const isTsp: boolean = this.start.info === this.desti.info
    const argument: any = {
      0: { lat: this.start.latitude, lng: this.start.longitude },
    }
    let key = 1
    for (const value of this.$store.state.sightList) {
      const item = { lng: value.position[0], lat: value.position[1] }
      argument[key] = item
      key++
    }
    // 如果起点终点不一样的话
    if (!isTsp)
      argument[key] = { lat: this.desti.latitude, lng: this.desti.longitude }
    ;(this as any).$http
      .get('/path/recommend', { sightList: JSON.stringify(argument), isTsp })
      .then((response: any) => {
        console.log(response)
        const sightArr = response.bestRouter.slice(1)
        let arr = new Array(),
          num = 1
        for (const value of sightArr) {
          if (num % 5 === 0) {
            console.log(arr)
            this.scenicArr.push(arr)
            arr = new Array()
            num = 1
          }
          num++
          arr.push(this.$store.state.sightList[value - 1])
        }
        console.log('景点列表', this.scenicArr)

        if (arr.length !== 0) this.scenicArr.push(arr)
        this.dailyScenic = this.scenicArr[0]
        console.log('景点列表', this.$store.state.sightList)
        loading.close()
      })
  }
}
</script>

<style lang="scss">
.guide-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 90px;
  background-image: url('../assets/images/home/home01.jpg');
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