<template>
  <div id="app">
    <div class="travel-wrapper">
      <div class="travel-nav">
        <Navbar v-if="$store.state.showNav"></Navbar>
        <div class="nav-btn" @click="changeNavDisplay">
          <div>{{navText}}</div>
        </div>
      </div>
      <div class="notify" v-if="!ifIntercourse && login">
        <el-badge :value="msgNum" class="item">
          <el-button size="small" @click="hangdleClick(`/intercourse`)">消息</el-button>
        </el-badge>
      </div>
      <div class="returnHome" v-else-if="ifIntercourse && login">
        <el-button size="small" @click="hangdleClick(`/home`)">返回主页</el-button>
      </div>
      <div class="travel-content">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Navbar from './components/common/Navbar.vue'
@Component({
  components: {
    Navbar,
  },
})
export default class App extends Vue {
  public msgNum: number = 0
  public ifIntercourse = false
  public timeoutId: number = 0
  public login: boolean = false
  public navText: string = '<'
  @Watch('$store.state.unreadMsg', { immediate: true })
  hangdle(newval: number) {
    this.msgNum = newval
  }
  @Watch('$store.state.isConnect')
  handle(newval: boolean) {
    clearInterval(this.timeoutId)
  }
  @Watch('$route')
  handleWatch(newVal: any) {
    if (newVal.path === '/intercourse') {
      this.$store.state.showNav = false
      this.ifIntercourse = true
      this.$store.state.unreadMsg = 0
    } else {
      this.$store.state.showNav = true
      this.$store.state.unreadMsg = 0
      this.ifIntercourse = false
    }
    // 会出问题不？
    if (newVal.path === '/login' || newVal.path === '/register') {
      this.login = false
    } else this.login = true
  }
  public hangdleClick(index: string) {
    this.$router.push(index)
  }
  public changeNavDisplay(): void {
    // 切换nav显示隐藏
    if (this.navText === '<') {
      this.$store.state.showNav = false
      this.navText = '>'
    } else {
      this.$store.state.showNav = true
      this.navText = '<'
    }
  }
  public created() {
    this.timeoutId = setInterval(async () => {
      const userName = sessionStorage.getItem('userName')
      ;(this as any).$http
        .get('/chat/getMsgNum', {
          userName,
        })
        .then((res: any) => {
          this.$store.state.unreadMsg = res.MsgNum
        })
    }, 4000)
  }
}
</script>
<style lang='scss'>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-width: 1080px;
}
iframe {
  display: none;
}
.travel-wrapper {
  width: 100%;
  height: 100%;
  .notify {
    position: fixed;
    z-index: 100;
    top: 20px;
    right: 2%;
  }
  .returnHome {
    position: fixed;
    z-index: 1;
    top: 10px;
    right: 2%;
  }
  .travel-nav {
    position: fixed;
    // left: calc(50% - 300px);
    // top: 0;
    width: 100%;
    z-index: 999;
    .nav-btn {
      width: 20px;
      height: 75px;
      background: rgba($color: white, $alpha: 0.5);
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: lightgray;
      position: fixed;
      left: 0;
      top: 0;
      cursor: pointer;
      &:hover {
        background: rgba($color: yellow, $alpha: 0.5);
        color: white;
      }
      div {
        transform: scale(0.9, 2);
        margin-bottom: 10px;
      }
    }
  }
  .travel-content {
    width: 100%;
    height: 100%;
    min-width: 800px;
  }
}
</style>
