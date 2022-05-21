<template>
  <div class="plan-wrapper">
    <div class="require-wrapper" v-if="showController1">
      <div class="time-chooser" @click="getChoosedTime">
        <div :class="['timer', timeChooser1 ? 'normal-timer' : 'choosed-timer']">
          1天
        </div>
        <div :class="['timer', timeChooser2 ? 'normal-timer' : 'choosed-timer']">
          2天
        </div>
        <div :class="['timer', timeChooser3 ? 'normal-timer' : 'choosed-timer']">
          3天
        </div>
        <div :class="['timer', timeChooser4 ? 'normal-timer' : 'choosed-timer']">
          4天
        </div>
        <div :class="['timer', timeChooser5 ? 'normal-timer' : 'choosed-timer']">
          5天
        </div>
        <div :class="['timer', timeChooser6 ? 'normal-timer' : 'choosed-timer']">
          6天
        </div>
        <div :class="['timer', timeChooser7 ? 'normal-timer' : 'choosed-timer']">
          7天
        </div>
      </div>
      <div class="confirm">
        <el-button type="plain" @click="toChooseMode">{{ btnText }}</el-button>
      </div>
    </div>
    <div class="recommendation-wrapper" v-else>
      <div class="mask-wrapper" v-show="ifShowMask">
        <div class="mode1-wrapper" v-show="ifShowKindChooser">
          <div class="title">
            <span>*</span>
            <span>请选择你喜欢的景点类别</span>
          </div>
          <div class="kind-chooser">
            <el-radio-group v-model="choosedKind">
              <el-radio :label="'寺庙观宇'">寺庙观宇</el-radio>
              <el-radio :label="'休闲公园'">休闲公园</el-radio>
              <el-radio :label="'娱乐消遣'">娱乐消遣</el-radio>
              <el-radio :label="'闽南特色'">闽南特色</el-radio>
              <el-radio :label="'历史风情'">历史风情</el-radio>
              <el-radio :label="'文艺清新'">文艺清新</el-radio>
              <el-radio :label="'自然风光'">自然风光</el-radio>
            </el-radio-group>
          </div>
          <div class="window-btn">
            <el-button type="plain" @click="confirmKind">confirm</el-button>
            <el-button type="plain" @click="cancelChoose">cancel</el-button>
          </div>
        </div>
        <div class="mode2-wrapper" v-show="ifShowInputer">
          <div class="title">
            <span>*</span>
            <span>请输入你对心仪景点的描述</span>
          </div>
          <div class="input-wrapper">
            <el-input v-model="userInput" placeholder="描述字数尽量多些哦~"></el-input>
          </div>
          <div class="window-btn">
            <el-button type="plain" @click="confirmInput">confirm</el-button>
            <el-button type="plain" @click="cancelInput">cancel</el-button>
          </div>
        </div>
      </div>
      <div class="mode-chooser">
        <div class="back-btn btn">
          <el-button type="plain" @click="toChooseTime">Back</el-button>
        </div>
        <div class="next-btn btn">
          <el-button type="plain" @click="toRoutePlan">Next</el-button>
        </div>
        <div class="mode-wrapper">
          <div :class="['mode', modeChooser1 ? 'normal-mode' : 'choosed-mode']" @click="toMode1">
            <div class="title">选择类别推荐</div>
            <div class="content">
              选择你喜欢的类别，系统会从该类别中推荐相应景点哦~
            </div>
          </div>
          <div :class="['mode', modeChooser2 ? 'normal-mode' : 'choosed-mode']" @click="toMode2">
            <div class="title">输入描述推荐</div>
            <div class="content">
              如果你不确定自己喜欢的类别，可以写下你对心仪景点的描述哦~
            </div>
          </div>
          <div :class="['mode', modeChooser3 ? 'normal-mode' : 'choosed-mode']" @click="toMode3">
            <div class="title">随机推荐</div>
            <div class="content">
              如果你有选择困难症，不妨试试随机推荐功能哦~
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({})
export default class extends Vue {
  public selectedTime: number = 1 // 旅行天数
  public showController1: boolean = true // 选择天数与选择模式切换
  public showController2: boolean = true // 选择模式与景点展示切换
  public btnText: string = '开始推荐' // 按钮文本
  public sightsClickList: number[] = [] // 储存点击的景点列表
  public timeChooser1: boolean = true // 存储时间的选择列表
  public timeChooser2: boolean = true
  public timeChooser3: boolean = true
  public timeChooser4: boolean = true
  public timeChooser5: boolean = true
  public timeChooser6: boolean = true
  public timeChooser7: boolean = true
  public modeChooser1: boolean = true // 存储模式的选择列表
  public modeChooser2: boolean = true
  public modeChooser3: boolean = true
  public choosedMode: number = 1 // 存储选中的推荐模式
  public choosedKind: string = '寺庙观宇' // 选中的景点类别
  public ifShowKindChooser: boolean = false // 是否显示类别选择器
  public ifShowMask: boolean = false // 是否显示遮罩
  public userInput: string = '' // 用户输入的景点描述
  public ifShowInputer: boolean = false // 用户输入弹窗

  public toChooseMode(): void {
    this.btnText = '确定模式'
    this.showController1 = false
  }
  public toChooseTime(): void {
    this.showController1 = true
    this.btnText = '开始推荐'
    this.modeChooser1 = true
    this.modeChooser2 = true
    this.modeChooser3 = true
  }

  public getChoosedTime(e: any): void {
    const index: number = Number.parseInt(e.target.innerText[0], 10)
    this.selectedTime = index
    const s = 'timeChooser'
    for (let i = 1; i <= 7; i++) {
      if (index === i) {
        ;(this as any)[s + i] = false
      } else {
        ;(this as any)[s + i] = true
      }
    }
  }
  public toMode1(): void {
    this.modeChooser1 = false
    this.modeChooser2 = true
    this.modeChooser3 = true
    this.choosedMode = 1
  }
  public toMode2(): void {
    this.modeChooser1 = true
    this.modeChooser2 = false
    this.modeChooser3 = true
    this.choosedMode = 2
  }
  public toMode3(): void {
    this.modeChooser1 = true
    this.modeChooser2 = true
    this.modeChooser3 = false
    this.choosedMode = 3
  }
  public toRoutePlan(): void {
    // 景点展示
    if (this.choosedMode === 1) {
      this.ifShowKindChooser = true
      this.ifShowMask = true
      this.modeChooser1 = true
    } else if (this.choosedMode === 2) {
      this.ifShowInputer = true
      this.ifShowMask = true
      this.modeChooser2 = true
    } else {
      this.showController2 = false
      this.modeChooser3 = true
      const loading = this.$loading({
        lock: true,
        text: '正在八百里加急获取景点信息！！！',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.7)',
      })
      setTimeout(() => {
        loading.close()
        this.$router.push('/guide')
      }, 2000)
      ;(this as any).$http
        .get('/yx/getRandomSight', { day: this.selectedTime, user: 'yangxuan' })
        .then((res: any) => {
          loading.close()
          this.$router.push('/guide')

          this.$store.state.sightList = res.sightList
        })
    }
  }
  public backToChooseMode(): void {
    this.showController2 = true
  }
  public toGuideView(): void {
    this.$router.push('/guide')
  }
  public confirmKind(): void {
    this.showController2 = false
    this.ifShowKindChooser = false
    this.ifShowMask = false
    const loading = this.$loading({
      lock: true,
      text: '正在八百里加急获取景点信息！！！',
      spinner: 'el-icon-loading',
      background: 'rgba(0,0,0,0.7)',
    })
    setTimeout(() => {
      loading.close()
      this.$router.push('/guide')
    }, 2000)
    ;(this as any).$http
      .get('/yx/getSightKind', {
        kind: this.choosedKind,
        day: this.selectedTime,
      })
      .then((res: any) => {
        this.$store.state.sightList = res.sightList
      })
  }
  public cancelChoose(): void {
    this.ifShowKindChooser = false
    this.ifShowMask = false
    this.modeChooser1 = true
  }
  public confirmInput(): void {
    this.showController2 = false
    this.ifShowInputer = false
    this.ifShowMask = false
    const loading = this.$loading({
      lock: true,
      text: '正在八百里加急获取景点信息！！！',
      spinner: 'el-icon-loading',
      background: 'rgba(0,0,0,0.7)',
    })
    setTimeout(() => {
      loading.close()
      this.$router.push('/guide')
    }, 2000)
    ;(this as any).$http
      .get('/yx/getCertainSight', {
        userInput: this.userInput,
        day: this.selectedTime,
      })
      .then((res: any) => {
        this.$store.state.sightList = res.sightList
      })
  }
  public cancelInput(): void {
    this.ifShowInputer = false
    this.ifShowMask = false
    this.modeChooser2 = true
  }
}
</script>

<style lang="scss" scoped>
.plan-wrapper {
  width: 100%;
  height: calc(100vh - 1px);
  border-top: 1px solid lightgreen;
  background-image: url('~@/assets/images/plan/plan02.jpg');
  background-size: cover;
  .require-wrapper {
    // background: white;
    width: 70%;
    margin-left: 15%;
    margin-top: 120px;
    .time-chooser {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .timer {
        height: 50px;
        font-size: 25px;
        color: white;
        font-weight: bold;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
      }
      .normal-timer {
        opacity: 1;
      }
      .choosed-timer {
        opacity: 0.3;
      }
      .timer:hover {
        opacity: 0.3;
      }
    }
    .time-chooser div:nth-child(1) {
      width: 14%;
      background: rgba($color: rgb(158, 249, 158), $alpha: 1);
    }
    .time-chooser div:nth-child(2) {
      width: 28%;
      background: rgba($color: rgb(122, 243, 122), $alpha: 1);
    }
    .time-chooser div:nth-child(3) {
      width: 42%;
      background: rgba($color: rgb(91, 246, 91), $alpha: 1);
    }
    .time-chooser div:nth-child(4) {
      width: 56%;
      background: rgba($color: rgb(61, 244, 61), $alpha: 1);
    }
    .time-chooser div:nth-child(5) {
      width: 70%;
      background: rgba($color: rgb(37, 214, 37), $alpha: 1);
    }
    .time-chooser div:nth-child(6) {
      width: 84%;
      background: rgba($color: rgb(18, 159, 18), $alpha: 1);
    }
    .time-chooser div:nth-child(7) {
      width: 98%;
      background: rgba($color: rgb(6, 116, 6), $alpha: 1);
    }
    .confirm {
      margin-left: calc(50% - 100px);
      // margin-top: 30px;
      .el-button {
        width: 200px;
        height: 50px;
        margin-top: 25px;
        color: white;
        background: linear-gradient(
          to right,
          rgba($color: rgb(158, 249, 158), $alpha: 1),
          rgba($color: rgb(6, 116, 6), $alpha: 1)
        );
        font-size: 20px;
        font-weight: bold;
        &:hover {
          background: linear-gradient(
            to left,
            rgba($color: rgb(158, 249, 158), $alpha: 1),
            rgba($color: rgb(6, 116, 6), $alpha: 1)
          );
        }
      }
    }
  }
  .recommendation-wrapper {
    width: 60%;
    height: 420px;
    margin-left: 20%;
    margin-top: 130px;
    background: rgba($color: white, $alpha: 1);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mask-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      background: rgba($color: white, $alpha: 0.5);
    }
    .mode-chooser {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .mode-wrapper {
        width: 80%;
        height: 80%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .mode {
          width: 28%;
          height: 50%;
          cursor: pointer;
          .title {
            background: lightgreen;
            text-align: center;
            height: 20%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            color: white;
          }
          .content {
            background: lightgray;
            height: 80%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: gray;
          }
        }
        .normal-mode {
          opacity: 1;
        }
        .choosed-mode {
          opacity: 0.3;
        }
        .mode:hover {
          opacity: 0.3;
        }
      }
      .btn {
        position: absolute;
        top: 0;
        .el-button {
          width: 60px;
          height: 30px;
          color: gray;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba($color: lightgreen, $alpha: 0.5);
          font-size: 16px;
          &:hover {
            background: rgba($color: green, $alpha: 0.5);
            color: white;
            font-weight: bold;
          }
        }
      }
      .back-btn {
        left: 0;
      }
      .next-btn {
        right: 0;
      }
    }
    .mode1-wrapper {
      /* 选择景点类别弹窗 */
      position: absolute;
      // left: 15%;
      // top: 35%;
      width: 70%;
      height: 30%;
      background: rgba($color: white, $alpha: 1);
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-direction: column;
      .kind-chooser {
        .el-radio-group {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }
      }
      .window-btn {
        display: flex;
        .el-button {
          width: 100px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover {
            color: white;
            background: lightgreen;
          }
        }
      }
      .title span:nth-child(1) {
        color: red;
        font-size: 18px;
      }
      .title span:nth-child(2) {
        color: gray;
        font-size: 18px;
      }
    }
    .mode2-wrapper {
      /* 用户输入弹窗 */
      position: absolute;
      // left: 15%;
      // top: 35%;
      width: 70%;
      height: 30%;
      background: rgba($color: white, $alpha: 1);
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-direction: column;
      .window-btn {
        display: flex;
        .el-button {
          width: 100px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover {
            color: white;
            background: lightgreen;
          }
        }
      }
      .title span:nth-child(1) {
        color: red;
        font-size: 18px;
      }
      .title span:nth-child(2) {
        color: gray;
        font-size: 18px;
      }
      .input-wrapper {
        width: 80%;
      }
    }
  }
}
</style>