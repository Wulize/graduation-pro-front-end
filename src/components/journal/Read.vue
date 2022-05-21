<template>
  <div class="read-wrapper">
    <div class="journal-list" ref="listWrapper" v-if="ifShowList">
      <div class="list-column1 list-item">
        <div class="item" v-for="(journal, index) in journalList1" :key="index" @click="toWatchJournal(journal)">
          <div class="item-tag">
            <div class="tag">{{ journal.tab }}</div>
            <div class="time">{{ journal.date }}</div>
          </div>
          <div class="title" @click="toWatchJournal(journal)">
            {{ journal.title }}
          </div>
          <div class="pic"><img :src="journal.headPic" /></div>
          <div class="user">
            <div class="user-info">
              <div class="avatar">
                <img src="~@/assets/images/home/home03.jpg" />
              </div>
              <div class="name">{{ journal.userName }}</div>
            </div>
            <div class="user-action">
              <div class="view">
                <i class="el-icon-view"></i>
                <span>{{ journal.viewCount }}</span>
              </div>
              <div class="good">
                <i :class="[
                    'el-icon-lollipop',
                    starList.includes(journal.id) ? 'selected' : 'normal',
                  ]" @click="good(journal)"></i>
                <span>{{ journal.starCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="list-column2 list-item">
        <div class="item" v-for="(journal, index) in journalList2" :key="index" @click="toWatchJournal(journal)">
          <div class="item-tag">
            <div class="tag">{{ journal.tab }}</div>
            <div class="time">{{ journal.date }}</div>
          </div>
          <div class="title" @click="toWatchJournal(journal)">
            {{ journal.title }}
          </div>
          <div class="pic"><img :src="journal.headPic" /></div>
          <div class="user">
            <div class="user-info">
              <div class="avatar">
                <img src="~@/assets/images/home/home03.jpg" />
              </div>
              <div class="name">{{ journal.userName }}</div>
            </div>
            <div class="user-action">
              <div class="view">
                <i class="el-icon-view"></i>
                <span>{{ journal.viewCount }}</span>
              </div>
              <div class="good">
                <i :class="[
                    'el-icon-lollipop',
                    starList.includes(journal.id) ? 'selected' : 'normal',
                  ]" @click="good(journal)"></i>
                <span>{{ journal.starCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="list-column3 list-item">
        <div class="item" v-for="(journal, index) in journalList3" :key="index" @click="toWatchJournal(journal)">
          <div class="item-tag">
            <div class="tag">{{ journal.tab }}</div>
            <div class="time">{{ journal.date }}</div>
          </div>
          <div class="title" @click="toWatchJournal(journal)">
            {{ journal.title }}
          </div>
          <div class="pic"><img :src="journal.headPic" /></div>
          <div class="user">
            <div class="user-info">
              <div class="avatar">
                <img src="~@/assets/images/home/home03.jpg" />
              </div>
              <div class="name">{{ journal.userName }}</div>
            </div>
            <div class="user-action">
              <div class="view">
                <i class="el-icon-view"></i>
                <span>{{ journal.viewCount }}</span>
              </div>
              <div class="good">
                <i :class="[
                    'el-icon-lollipop',
                    starList.includes(journal.id) ? 'selected' : 'normal',
                  ]" @click="good(journal)"></i>
                <span>{{ journal.starCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="watch-wrapper" v-else>
      <div class="head-pic">
        <img :src="choosedJournal.headPic" />
        <div class="title-part">
          <div class="title">{{ choosedJournal.title }}</div>
          <div class="author">by {{ choosedJournal.userName }}</div>
        </div>
        <div class="back-btn">
          <el-button type="plain" icon="el-icon-back" @click="backToList"></el-button>
        </div>
      </div>
      <div class="hide-scroll">
        <div class="content" v-html="choosedJournal.content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class extends Vue {
  public ifGood: boolean = false // 控制读写切换
  public currentPage: number = 1 // 当前页码
  public journalList1: any[] = [] // 游记列表1
  public journalList2: any[] = [] // 游记列表2
  public journalList3: any[] = [] // 游记列表3
  public timer: any = null // 节流定时器
  public ifShowList: boolean = true // 游记列表 or 某篇游记的查看
  public choosedJournal: any = {} // 点击的游记
  public viewList: string[] = [] // 用户浏览的游记列表
  public starList: string[] = [] // 用户点赞的游记列表

  public good(journal: any): void {
    // 用户点赞，将该游记加入到游记列表
    if (this.starList.includes(journal.id)) {
      const index = this.starList.indexOf(journal.id)
      this.starList.splice(index, 1)
      journal.starCount -= 1
    } else {
      this.starList.push(journal.id)
      journal.starCount += 1
    }
  }

  public handleScroll(): void {
    // 监听滚动事件
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const scrollTop = document.documentElement.scrollTop
      if (clientHeight + scrollTop === scrollHeight) {
        this.getJournal()
      }
    }, 500)
  }

  public toWatchJournal(journal: any): void {
    // 查看游记
    this.choosedJournal = journal
    window.removeEventListener('scroll', this.handleScroll, true)
    this.ifShowList = false
    if (!this.viewList.includes(journal.id)) {
      this.viewList.push(journal.id)
      journal.viewCount += 1
    }
  }
  public backToList(): void {
    // 返回游记列表
    this.ifShowList = true
    window.addEventListener('scroll', this.handleScroll, true)
  }
  public getJournal(): void {
    // 获取游记
    ;(this as any).$http
      .get('/yx/getJournal', {
        currentPage: this.currentPage,
      })
      .then((data: any) => {
        if (data.journalList.length === 0) {
          this.$message({
            showClose: true,
            message: '没有更多游记了哦！',
            type: 'warning',
          })
          window.removeEventListener('scroll', this.handleScroll, true)
        } else {
          const journalList = data.journalList
          let index = 1
          for (const value of journalList) {
            if (index === 1) {
              this.journalList1.push(value)
              index++
            } else if (index === 2) {
              this.journalList2.push(value)
              index++
            } else {
              this.journalList3.push(value)
              index = 1
            }
          }
          this.currentPage += 1
          console.log(this.journalList1)
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  mounted() {
    this.getJournal()
  }

  created() {
    window.addEventListener('scroll', this.handleScroll, true)
  }
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll, true)
    if (!(this.viewList.length === 0 && this.starList.length === 0)) {
      ;(this as any).$http
        .post('/yx/modifyJournal', {
          viewList: this.viewList,
          starList: this.starList,
        })
        .then((res: any) => {
          console.log(res)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.read-wrapper {
  width: 95%;
  padding-bottom: 30px;
  // height: 100%;
  .journal-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .list-item {
      width: 320px;
      .item {
        background: white;
        border-radius: 10px;
        border: 1px solid white;
        box-shadow: 0 0 10px white;
        cursor: pointer;
        &:not(:nth-child(1)) {
          margin-top: 30px;
        }
        &:hover {
          transform: scale(1.1);
        }
        .item-tag {
          display: flex;
          align-items: center;
          margin-left: 20px;
          margin-top: 20px;
          .tag {
            background: lightgreen;
            font-size: 17px;
            color: white;
            // width: 60px;
            height: 25px;
            text-align: center;
            line-height: 25px;
            border-radius: 5px;
          }
          .time {
            font-size: 17px;
            color: rgba($color: gray, $alpha: 0.5);
            margin-left: 20px;
          }
        }
        .title {
          font-size: 22px;
          color: gray;
          margin-left: 20px;
          margin-top: 15px;
          cursor: pointer;
          &:hover {
            opacity: 0.6;
            animation: wordMove 2s infinite;
          }
          @keyframes wordMove {
            0% {
              margin-left: 20px;
            }
            // 50% {
            //   margin-left: 50px;
            // }
            100% {
              margin-left: 50px;
            }
          }
        }
        .pic {
          //   display: flex;
          margin-top: 15px;
          margin-left: 20px;
          img {
            width: 90%;
            object-fit: cover;
            margin-bottom: 20px;
          }
        }
        .user {
          display: flex;
          align-items: center;
          margin-left: 20px;
          width: 84.5%;
          justify-content: space-between;
          margin-bottom: 20px;
          .user-info {
            display: flex;
            align-items: center;
            cursor: pointer;
            .avatar {
              img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
              }
            }
            .name {
              color: gray;
              font-size: 17px;
              margin-left: 10px;
            }
          }
          .user-action {
            display: flex;
            width: 35%;
            justify-content: space-evenly;
            .view {
              i {
                font-size: 21px;
                color: gray;
              }
              span {
                font-size: 17px;
                color: gray;
                margin-left: 5px;
              }
            }
            .good {
              i {
                font-size: 21px;
                cursor: pointer;
                &:hover {
                  color: palevioletred;
                }
              }
              .normal {
                color: gray;
              }
              .selected {
                color: palevioletred;
              }
              span {
                font-size: 17px;
                color: gray;
                margin-left: 5px;
              }
            }
          }
        }
      }
    }
  }
  .watch-wrapper {
    .head-pic {
      width: 100%;
      height: 350px;
      position: relative;
      box-shadow: 0 0 10px white;
      img {
        width: 100%;
        height: 350px;
        object-fit: cover;
      }
      .title-part {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        background: linear-gradient(to bottom, white, lightgreen, white);
        box-shadow: 0 0 10px white;
        .title {
          font-size: 50px;
          color: gray;
        }
        .author {
          font-size: 20px;
          color: rgba($color: gray, $alpha: 0.7);
        }
      }
      .back-btn {
        position: absolute;
        left: 0;
        top: 0;

        .el-button {
          width: 50px;
          height: 30px;
          font-size: 20px;
          color: gray;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to right, white, rgb(189, 237, 189), white);
          &:hover {
            background: lightgreen;
            color: white;
            height: 50px;
            border-radius: 50%;
          }
        }
      }
    }
    .hide-scroll {
      width: 100%;
      height: 500px;
      margin-top: 30px;
      overflow: hidden;
      background: rgba($color: white, $alpha: 1);
      box-shadow: 0 0 10px white;
      .content {
        width: 105%;
        height: 500px;
        overflow: auto;
        margin-top: 0;
      }
    }
  }
}
</style>