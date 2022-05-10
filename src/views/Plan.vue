<template>
  <div class="plan-wrapper">
    <div class="require-wrapper" v-if="ifShowRequireList">
      <div class="require-chooser">
        <div class="time">
          <div class="title">旅行天数</div>
          <el-radio-group v-model="selectedTime" class="radio-group">
            <el-radio :label="1"></el-radio>
            <el-radio :label="2"></el-radio>
            <el-radio :label="3"></el-radio>
            <el-radio :label="4"></el-radio>
            <el-radio :label="5"></el-radio>
            <el-radio :label="6"></el-radio>
            <el-radio :label="7"></el-radio>
          </el-radio-group>
        </div>
        <div class="person">
          <div class="title">旅行人数</div>
          <el-slider v-model="selectedPersonCount" :min="1" :max="10"></el-slider>
        </div>
        <div class="budget">
          <div class="title">旅行预算</div>
          <el-slider v-model="selectedBudget" :min="1" :max="5000"></el-slider>
        </div>
        <div class="style">
          <div class="title">旅行风格</div>
          <el-radio-group v-model="selectedStyle" class="radio-group">
            <el-radio :label="'休闲放松'"></el-radio>
            <el-radio :label="'唯美浪漫'"></el-radio>
            <el-radio :label="'文艺清新'"></el-radio>
            <el-radio :label="'感官盛宴'"></el-radio>
            <el-radio :label="'其他'"></el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="require-list">
        <div class="title">Require List</div>
        <div class="list">
          <div class="time">
            <span class="choosed">你选择的旅行天数：</span>
            <span class="value">{{selectedTime}}</span>
          </div>
          <div class="person">
            <span class="choosed">你选择的旅行人数：</span>
            <span class="value">{{selectedPersonCount}}</span>
          </div>
          <div class="budget">
            <span class="choosed">你选择的旅行预算：</span>
            <span class="value">{{selectedBudget}}</span>
          </div>
          <div class="style">
            <span class="choosed">你选择的旅行风格：</span>
            <span class="value">{{selectedStyle}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="sights-wrapper" v-else>
      <div class="back-btn">
        <el-button type="plain" @click="toRequireList">Back</el-button>
      </div>
      <TimeLine></TimeLine>
      <div class="sights-display">
        <div class="sight" v-for="item in sightsInfo" :key="item" @click="controlPicOrInfo(item.index)">
          <div class="pic" v-if="!sightsClickList.includes(item.index)">{{item.index}}</div>
          <div class="info" v-else>我是景点介绍</div>
        </div>
      </div>
    </div>
    <div class="confirm">
      <el-button type="plain" @click="produceSights">{{btnText}}</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import TimeLine from '../components/plan/TimeLine.vue'
@Component({
  components: {
    TimeLine,
  },
})
export default class extends Vue {
  public selectedTime: number = 1 // 旅行天数
  public selectedPersonCount: number = 1 // 旅行人数
  public selectedBudget: number = 0 // 旅行预算
  public selectedStyle: string = '其他' // 旅行风格
  public ifShowRequireList: boolean = true // 控制需求与景点的显示隐藏
  public btnText: string = '开始定制' // 按钮文本
  public sightsInfo: any[] = [{ index: 1 }, { index: 2 }, { index: 3 }] // 存储选中天数景点信息
  public sightsClickList: number[] = [] // 储存点击的景点列表

  public produceSights(): void {
    this.btnText = '生成路线'
    this.ifShowRequireList = false
  }
  public toRequireList(): void {
    this.ifShowRequireList = true
    this.btnText = '开始定制'
  }
  public controlPicOrInfo(index: number): void {
    // 控制显示图片还是详情
    if (this.sightsClickList.includes(index)) {
      // 如果列表包含该index，表明现在是info,则删除该index
      this.sightsClickList.splice(this.sightsClickList.indexOf(index), 1)
    } else {
      this.sightsClickList.push(index)
    }
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
    width: 80%;
    display: flex;
    margin-top: 105px;
    margin-left: 10%;
    background: rgba($color: white, $alpha: 1);
    .require-chooser {
      width: 50%;
      border-right: 5px solid rgba($color: lightblue, $alpha: 0.6);
      .time {
        width: 100%;
        height: 90px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        background: rgba($color: yellow, $alpha: 0.5);
        margin-top: 15px;
        .title {
          color: yellowgreen;
          font-size: 20px;
          font-weight: bold;
        }
        .radio-group {
          /deep/ .el-radio {
            color: lightgray;
            .el-radio__label {
              font-size: 16px;
              padding-left: 5px;
            }
            .el-radio__input {
              width: 22px;
              height: 22px;
            }
            .el-radio__inner {
              width: 18px;
              height: 18px;
            }

            &:hover {
              color: yellowgreen;
              border-color: red;
              .el-radio__inner {
                border-color: yellowgreen;
              }
            }
            .el-radio__input.is-checked .el-radio__inner {
              /* 选中圆点样式 */
              border-color: lightblue;
              background: lightblue;
            }
            .el-radio__input.is-checked + .el-radio__label {
              /* 选中文本样式 */
              color: lightblue;
              font-weight: bold;
            }
          }
        }
      }
      .person {
        width: 100%;
        height: 90px;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        background: rgba($color: yellow, $alpha: 0.5);
        .title {
          color: yellowgreen;
          font-size: 20px;
          font-weight: bold;
        }
        /deep/ .el-slider {
          width: 80%;
          .el-slider__bar {
            background-color: lightblue;
          }
          .el-slider__button {
            border: 2px solid lightblue;
          }
        }
      }
      .budget {
        width: 100%;
        height: 90px;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        background: rgba($color: yellow, $alpha: 0.5);
        .title {
          color: yellowgreen;
          font-size: 20px;
          font-weight: bold;
        }
        /deep/ .el-slider {
          width: 80%;
          .el-slider__bar {
            background-color: lightblue;
          }
          .el-slider__button {
            border: 2px solid lightblue;
          }
        }
      }
      .style {
        width: 100%;
        height: 90px;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        background: rgba($color: yellow, $alpha: 0.5);
        .title {
          color: yellowgreen;
          font-size: 20px;
          font-weight: bold;
        }
        .radio-group {
          /deep/ .el-radio {
            color: lightgray;
            margin-right: 20px;
            .el-radio__label {
              font-size: 16px;
              padding-left: 5px;
            }
            .el-radio__input {
              width: 22px;
              height: 22px;
            }
            .el-radio__inner {
              width: 18px;
              height: 18px;
            }

            &:hover {
              color: yellowgreen;
              border-color: red;
              .el-radio__inner {
                border-color: yellowgreen;
              }
            }
            .el-radio__input.is-checked .el-radio__inner {
              /* 选中圆点样式 */
              border-color: lightblue;
              background: lightblue;
            }
            .el-radio__input.is-checked + .el-radio__label {
              /* 选中文本样式 */
              color: lightblue;
              font-weight: bold;
            }
          }
        }
      }
    }
    .require-list {
      width: 50%;
      height: 420px;
      // background: rgba($color: white, $alpha: 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        font-size: 36px;
        color: yellowgreen;
        font-weight: bold;
        margin-top: 20px;
      }
      .list {
        font-size: 20px;
        font-weight: bold;
        margin-top: 30px;
        background: rgba($color: yellow, $alpha: 0.5);
        height: 70%;
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        .time {
          .choosed {
            color: lightblue;
          }
          .value {
            color: rgba($color: rgb(245, 104, 104), $alpha: 0.8);
          }
        }
        .person {
          .choosed {
            color: lightblue;
          }
          .value {
            color: rgba($color: rgb(245, 104, 104), $alpha: 0.8);
          }
        }
        .budget {
          .choosed {
            color: lightblue;
          }
          .value {
            color: rgba($color: rgb(245, 104, 104), $alpha: 0.8);
          }
        }
        .style {
          .choosed {
            color: lightblue;
          }
          .value {
            color: rgba($color: rgb(245, 104, 104), $alpha: 0.8);
          }
        }
      }
    }
  }
  .sights-wrapper {
    width: 80%;
    height: 420px;
    margin-left: 10%;
    margin-top: 105px;
    background: rgba($color: white, $alpha: 1);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .back-btn {
      position: absolute;
      left: 0;
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
    .sights-display {
      width: 90%;
      height: 80%;
      background: rgba($color: lightgray, $alpha: 0.5);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .sight {
        width: 32%;
        height: 90%;
        background: yellow;
        cursor: pointer;
        &:hover {
          opacity: 0.5;
        }
      }
    }
  }
  .confirm {
    margin-left: calc(50% - 100px);
    // margin-top: 30px;
    .el-button {
      width: 200px;
      height: 50px;
      margin-top: 25px;
      color: yellowgreen;
      font-size: 20px;
      font-weight: bold;
      &:hover {
        background: rgba($color: yellow, $alpha: 0.5);
        color: white;
      }
    }
  }
}
</style>