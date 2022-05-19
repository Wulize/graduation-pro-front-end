<template>
  <div class="sight-wrapper">
    <div class="sight-catagory">
      <div class="sight-list">
        <div :class="[
            'all-sights',
            styleList.ifListOneStyleNormal ? 'normal-div' : 'selected-div',
          ]" @click="getAllSights">
          全部景点
        </div>
        <div :class="[
            'child-sights',
            styleList.ifListTwoStyleNormal ? 'normal-div' : 'selected-div',
          ]" @click="getChildSights">
          亲子游
        </div>
        <div :class="[
            'night-sights',
            styleList.ifListThreeStyleNormal ? 'normal-div' : 'selected-div',
          ]" @click="getNightSights">
          夜·厦门
        </div>
        <div :class="[
            'museum-sights',
            styleList.ifListFourStyleNormal ? 'normal-div' : 'selected-div',
          ]" @click="getMuseumSights">
          博物馆
        </div>
        <div :class="[
            'cat-sights',
            styleList.ifListFiveStyleNormal ? 'normal-div' : 'selected-div',
          ]" @click="getCatSights">
          撸猫集中地
        </div>
        <div :class="[
            'photo-sights',
            styleList.ifListSixStyleNormal ? 'normal-div' : 'selected-div',
          ]" @click="getPhotoSights">
          拍照好去处
        </div>
      </div>
    </div>
    <div class="sight-display">
      <div class="current-sight" v-if="ifShowThumbnail">
        <template v-for="sight in sightList">
          <div :key="sight.name" class="sight-div" @click="toSightInfo(sight.name)">
            <img :src="sight.pic" />
            <span>{{ sight.name }}</span>
          </div>
        </template>
      </div>
      <div class="info-wrapper" v-else>
        <el-button type="plain" icon="el-icon-back" class="back-btn" @click="backToThumbnail"></el-button>
        <div class="sight-info">
          <div class="sight-name">{{ sightInfo.name }}</div>
          <div class="sight-images">
            <div class="image-big"><img :src="sightInfo.images[0]" /></div>
            <div class="image-small">
              <img :src="sightInfo.images[1]" />
              <img :src="sightInfo.images[2]" />
            </div>
          </div>
          <div class="sight-summary">{{ sightInfo.summary }}</div>
          <div class="sight-transportation">
            <div class="title">交通</div>
            <div class="content">{{ sightInfo.transportation }}</div>
          </div>
          <div class="sight-ticket">
            <div class="title">门票</div>
            <div class="content">{{ sightInfo.ticket }}</div>
          </div>
          <div class="sight-opening">
            <div class="title">开放时间</div>
            <div class="content">{{ sightInfo.opening }}</div>
          </div>
          <div class="other-info">
            <div class="tel">
              <div class="title">联系电话</div>
              <div class="content">{{ sightInfo.tel }}</div>
            </div>
            <div class="time">
              <div class="title">建议用时</div>
              <div class="content">{{ sightInfo.time }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="left-arrow">
        <el-button type="plain" icon="el-icon-arrow-left" class="next-btn" @click="getLastPage"></el-button>
      </div>
      <div class="right-arrow">
        <el-button type="plain" icon="el-icon-arrow-right" class="next-btn" @click="getNextPage"></el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({
  components: {},
})
export default class extends Vue {
  // 列表项采用normal样式 or selected样式
  public styleList: any = {
    ifListOneStyleNormal: false,
    ifListTwoStyleNormal: true,
    ifListThreeStyleNormal: true,
    ifListFourStyleNormal: true,
    ifListFiveStyleNormal: true,
    ifListSixStyleNormal: true,
  }
  public sightList: any[] = [] // 接收后端传过来的景点
  public currentPage: number = 1 // 当前在哪页
  public currentRoute: string = '/getAllSights' // 当前在哪个景点分类
  public ifShowThumbnail: boolean = true // 是否显示景点详情
  public sightInfo: any = {} // 景点详情数据
  public sightName: string[] = [] // 存放景点名称，用于缩略图上下切换时发请求
  public currentSightName: string = '' // 存放当前景点名称
  public viewHistory: any = {} // 存放用户浏览过的历史记录

  public getAllSights(): void {
    // 点击所有景点
    this.currentPage = 1
    this.currentRoute = '/getAllSights'
    this.changeStyle('One')
    this.getSights(this.currentRoute)
    this.ifShowThumbnail = true
  }
  public getChildSights(): void {
    // 点击亲子游
    this.currentPage = 1
    this.currentRoute = '/getChildSights'
    this.changeStyle('Two')
    this.getSights(this.currentRoute)
    this.ifShowThumbnail = true
  }
  public getNightSights(): void {
    // 点击夜·厦门
    this.currentPage = 1
    this.currentRoute = '/getNightSights'
    this.changeStyle('Three')
    this.getSights(this.currentRoute)
    this.ifShowThumbnail = true
  }
  public getMuseumSights(): void {
    // 点击博物馆
    this.currentPage = 1
    this.currentRoute = '/getMuseumSights'
    this.changeStyle('Four')
    this.getSights(this.currentRoute)
    this.ifShowThumbnail = true
  }
  public getCatSights(): void {
    // 点击撸猫集中地
    this.currentPage = 1
    this.currentRoute = '/getCatSights'
    this.changeStyle('Five')
    this.getSights(this.currentRoute)
    this.ifShowThumbnail = true
  }
  public getPhotoSights(): void {
    // 点击拍照好去处
    this.currentPage = 1
    this.currentRoute = '/getPhotoSights'
    this.changeStyle('Six')
    this.getSights(this.currentRoute)
    this.ifShowThumbnail = true
  }
  public changeStyle(index: string): void {
    // 修改样式
    for (const key in this.styleList) {
      if (this.styleList.hasOwnProperty(key)) {
        if (key.indexOf(index) !== -1) {
          this.styleList[key] = false
        } else {
          this.styleList[key] = true
        }
      }
    }
  }
  public getLastPage(): void {
    // 上一页
    if (this.ifShowThumbnail === true) {
      // 如果当前是缩略图，进行上一页操作
      if (this.currentPage === 1) {
        this.$message({
          showClose: true,
          message: '已经是第一页了哦！',
          type: 'error',
        })
      } else {
        this.currentPage -= 1
        this.getSights(this.currentRoute)
      }
    } else {
      // 如果当前是景点详情，则进行上一个景点操作
      // 判断当前景点详情是不是第一个，如果是则重新请求上一页的数据
      if (this.currentSightName === this.sightName[0]) {
        // 是不是第一页
        if (this.currentPage === 1) {
          this.$message({
            showClose: true,
            message: '已经是第一页第一个景点了哦！',
            type: 'error',
          })
        } else {
          this.currentPage -= 1
          this.getSights(this.currentRoute, 1)
        }
      } else {
        this.toSightInfo(
          this.sightName[this.sightName.indexOf(this.currentSightName) - 1],
          1
        )
      }
    }
  }
  public getNextPage(): void {
    // 下一页
    let maxPage = 20
    if (this.currentRoute === '/getAllSights') {
      maxPage = 20
    } else {
      maxPage = 1
    }
    if (this.ifShowThumbnail === true) {
      // 判断当前是否是缩略图，如果是，则进行下一页操作
      if (this.currentPage === maxPage) {
        this.$message({
          showClose: true,
          message: '已经是最后一页了哦！',
          type: 'error',
        })
      } else {
        this.currentPage += 1
        this.getSights(this.currentRoute)
      }
    } else {
      // 如果是景点详情页，则进行下一个景点操作
      // 判断当前景点详情是不是最后一个，如果是则重新请求下一页的数据
      if (this.currentSightName === this.sightName[this.sightName.length - 1]) {
        // 是不是最后一页最后一个
        if (this.currentPage === maxPage) {
          this.$message({
            showClose: true,
            message: '已经是最后一页最后一个景点了哦！',
            type: 'error',
          })
        } else {
          this.currentPage += 1
          this.getSights(this.currentRoute, 2)

          // console.log(sightName)
        }
      } else {
        this.toSightInfo(
          this.sightName[this.sightName.indexOf(this.currentSightName) + 1],
          2
        )
      }
    }
  }

  public toSightInfo(sightName: string, type: number = 0): void {
    // 跳转到景点详情
    if (this.viewHistory[sightName]) {
      this.viewHistory[sightName]++
    } else {
      this.viewHistory[sightName] = 1
    }
    ;(this as any).$http
      .get('/yx/getSightInfo', { sightName })
      .then((data: any) => {
        this.sightInfo = data.sightInfo
        if (!this.sightInfo) {
          if (this.ifShowThumbnail === true) {
            // 如果是缩略图没有景点详情，直接toast提示
            this.$message({
              showClose: true,
              message: '暂无该景点信息！',
              type: 'warning',
            })
          } else {
            // 如果是详情页没有景点详情，加载(上)下一个景点
            if (type === 1) {
              this.currentSightName =
                this.sightName[
                  this.sightName.indexOf(this.currentSightName) - 1
                ]
              this.getLastPage()
            } else if (type === 2) {
              this.currentSightName =
                this.sightName[
                  this.sightName.indexOf(this.currentSightName) + 1
                ]
              this.getNextPage()
            }
          }
        } else {
          this.ifShowThumbnail = false
          this.currentSightName = sightName
          console.log(this.sightInfo)
        }
      })
  }

  public backToThumbnail(): void {
    // 返回到景点缩略图
    this.ifShowThumbnail = true
  }

  public getSights(route: string, from: number = 0): void {
    // 获取景点API
    ;(this as any).$http
      .get(`/yx${route}`, { currentPage: this.currentPage })
      .then((data: any) => {
        console.log(data.sightList) // 获取后端传递过来的数据：data.data
        this.sightList = data.sightList

        const sightName: string[] = []
        for (const sight of this.sightList) {
          // 存储该页景点名称
          sightName.push(sight.name)
        }
        this.sightName = sightName
        console.log(this.sightName)

        if (from === 1) {
          // 第一个景点
          this.toSightInfo(this.sightName[this.sightName.length - 1])
        } else if (from === 2) {
          // 最后一个景点
          this.toSightInfo(this.sightName[0])
        }
      })
  }

  created() {
    this.getSights(this.currentRoute)
  }
  beforeDestroy() {
    ;(this as any).$http
      .get('/yx/saveHistory', {
        history: this.viewHistory,
        user: 'yangxuan',
      })
      .then((res: any) => {
        console.log(res)
      })
  }
  // @Watch('sightList')
  // onSightListChanged(newVal: string) {
  //   const sightName: string[] = []
  //   for (const sight of this.sightList) {
  //     // 存储该页景点名称
  //     sightName.push(sight.name)
  //   }
  //   this.sightName = sightName
  //   console.log(this.sightName)
  // }
}
</script>

<style lang="scss">
.sight-wrapper {
  width: 100vw;
  height: calc(100vh - 1px);
  border-top: 1px solid lightblue;
  background-image: url('~@/assets/images/sight/sight01.jpg');
  background-size: cover;
  .sight-catagory {
    width: 100%;
    height: 5%;
    display: flex;
    justify-content: center;
    margin-top: 90px;
    .sight-list {
      height: 100%;
      background: rgba($color: white, $alpha: 0.6);
      display: flex;
      justify-content: center;
      position: relative;
      z-index: 99;
      div {
        height: 100%;
        font-size: 18px;
        padding-left: 15px;
        padding-right: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid lightgray;
        cursor: pointer;
        &:hover {
          border-bottom: 3px solid lightgray;
        }
      }
      .normal-div {
        color: gray;
      }
      .selected-div {
        background: orange;
        color: white;
      }
      & :nth-child(6) {
        border: none;
      }
    }
  }
  .sight-display {
    width: 80%;
    height: 80%;
    margin-left: 10%;
    position: relative;
    .current-sight {
      width: 100%;
      height: 100%;
      background: white;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
      /* 消除flex元素行与行之间的间距 */
      /* align-content:适用于多行    align-items:适用于单行 */
      .sight-div {
        width: 18%;
        height: 30%;
        border: 1px solid lightgray;
        text-align: center;
        margin-left: 1.5%;
        margin-top: 1%;
        img {
          width: 100%;
          height: 84%;
          object-fit: cover;
        }
        span {
          font-size: 15px;
          color: gray;
        }
        &:hover {
          cursor: pointer;
          opacity: 0.8;
          span {
            color: orange;
          }
        }
      }
      /*过滤多个元素*/
      // & :not(:nth-child(1)):not(:nth-child(6)):not(:nth-child(11)) {
      //   margin-left: 1%;
      // }
    }
    .info-wrapper {
      /* 景点详情 */
      width: 100%;
      height: 100%;
      position: relative;
      white-space: pre-wrap; /* 使得文本中的换行符生效  */
      background-image: url('~@/assets/images/sight/sight01.jpg');
      background-size: cover;
      .back-btn {
        position: absolute;
        left: 0;
        top: 0;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        background: rgba($color: white, $alpha: 0.6);
        box-shadow: 0 0 10px lightgray;
        border-radius: 0 0 50px 0;
        border: none;
        &:hover {
          color: white;
          background: orange;
        }
      }
      .sight-info {
        width: 100%;
        height: 100%;
        overflow: auto;
        .sight-name {
          font-size: 45px;
          text-align: center;
          margin-top: 3%;
          width: 90%;
          margin-left: 5%;
          background: rgba($color: white, $alpha: 0.6);
          box-shadow: 0 0 10px lightgray;
          color: gray;
        }
        .sight-images {
          width: 90%;
          height: 80%;
          margin-left: 5%;
          margin-top: 3%;
          display: flex;
          .image-big {
            width: 70%;
            img {
              width: 99%;
              height: 100%;
              object-fit: cover;
            }
          }
          .image-small {
            width: 30%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            img {
              width: 100%;
              height: 49%;
              object-fit: cover;
            }
          }
        }
        .sight-summary {
          width: 90%;
          margin-left: 5%;
          margin-top: 3%;
          font-size: 18px;
          line-height: 25px;
          background: rgba($color: white, $alpha: 0.6);
          box-shadow: 0 0 10px lightgray;
        }
        .other-info {
          width: 90%;
          margin-left: 5%;
          margin-top: 3%;
          display: flex;
          font-size: 16px;
          background: rgba($color: white, $alpha: 0.6);
          box-shadow: 0 0 10px lightgray;
          margin-bottom: 5%;
          .time {
            margin-left: 10%;
          }
        }
        .sight-transportation {
          width: 90%;
          margin-left: 5%;
          margin-top: 3%;
          font-size: 16px;
          line-height: 25px;
          background: rgba($color: white, $alpha: 0.6);
          box-shadow: 0 0 10px lightgray;
        }
        .sight-ticket {
          width: 90%;
          margin-left: 5%;
          margin-top: 3%;
          font-size: 16px;
          line-height: 25px;
          background: rgba($color: white, $alpha: 0.6);
          box-shadow: 0 0 10px lightgray;
        }
        .sight-opening {
          width: 90%;
          margin-left: 5%;
          margin-top: 3%;
          font-size: 16px;
          line-height: 25px;
          background: rgba($color: white, $alpha: 0.6);
          box-shadow: 0 0 10px lightgray;
        }
      }
    }
    .left-arrow {
      position: absolute;
      left: -50px;
      top: calc(50% - 25px);
      .next-btn {
        width: 50px;
        height: 50px;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: rgba($color: white, $alpha: 0.6);
        box-shadow: 0 0 10px lightgray;
        color: gray;
        &:hover {
          background: orange;
          color: white;
          animation: btn_rotate 3s infinite;
        }
      }
    }
    .right-arrow {
      position: absolute;
      left: 100%;
      top: calc(50% - 25px);
      .next-btn {
        width: 50px;
        height: 50px;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: rgba($color: white, $alpha: 0.6);
        box-shadow: 0 0 10px lightgray;
        color: gray;
        &:hover {
          background: orange;
          color: white;
        }
      }
    }
  }
}
</style>