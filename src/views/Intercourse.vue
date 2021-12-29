<template>
  <div class="chat-wrapper">
    <div class="myFriends">
      <el-select
        class="choice"
        v-model="value"
        filterable
        placeholder="查找好友"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div
        class="item"
        v-for="(item, i) in friends"
        :key="i"
        @click="chooseReciever($event)"
      >
        <el-avatar>{{ item }}</el-avatar>
        <p>{{ item }}</p>
      </div>
    </div>
    <div class="content">
      <div class="nickName">{{ id }}</div>
      <div class="mainContent">
        <div class="msg" v-for="(item, key) in msgList" :key="key">
          <p>
            from {{ item.send_name }} to {{ item.receiver }} at
            {{ item.send_time }}
          </p>
          <p>{{ item.send_msg }}</p>
        </div>
      </div>
      <div class="edit">
        <!-- 添加输入内容 -->
        <input
          id="text"
          type="text"
          placeholder="说点什么吧..."
          v-model="inputValue"
          @keyup.enter="chat"
        />
        <!-- 给发送也绑定一个事件 -->
        <span id="btn" @click="chat">发送</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
@Component
export default class Intercourse extends Vue {
  public id: string = "";
  public value: string = "";
  public inputValue: string = "";
  public path: string = "ws://localhost:3001?id=";
  public socket: any = {};
  public friends: string[] = ["请先添加好友"];
  public options: any[] = [
    {
      value: "选项1",
      label: "黄金糕",
    },
    {
      value: "选项2",
      label: "双皮奶",
    },
    {
      value: "选项3",
      label: "蚵仔煎",
    },
    {
      value: "选项4",
      label: "龙须面",
    },
    {
      value: "选项5",
      label: "北京烤鸭",
    },
  ];
  public msgList: any[] = [];
  public msgListObj: any = {};
  @Watch("msgListObj", { deep: true })
  handleWatch(val: any, oldVal: any) {
    this.msgList = this.msgListObj[this.id];
  }

  // 将输入的内容发送到服务器
  public async chat() {
    // 初始化
    const userName = sessionStorage.getItem("userName");
    const info: any = {
      type: "chat",
      send_time: new Date(),
      send_msg: this.inputValue,
      send_id: userName,
      send_name: userName,
      receiver: this.id,
    };
    this.inputValue = "";
    this.msgListObj[this.id].push(info);
    this.send(JSON.stringify(info));
  }
  // 初始化websocket相关配置
  private init() {
    if (typeof WebSocket === "undefined") {
      alert("您的浏览器不支持socket");
    } else {
      // 实例化socket
      // 首先获取用户名
      const userName = sessionStorage.getItem("userName");
      this.socket = new WebSocket(this.path + userName);
      // 监听socket连接
      this.socket.onopen = () => {
        console.log("socket连接成功");
      };
      // 监听socket错误信息
      this.socket.onerror = () => {
        console.log("连接错误");
      };
      // 监听socket消息
      this.socket.onmessage = (res: any) => {
        const data = JSON.parse(res.data);
        this.msgListObj[data.send_id].push(data);
      };
    }
  }
  public send(params: any) {
    this.socket.send(params);
  }
  public close() {
    console.log("socket已经关闭");
  }
  // 查找好友列表
  public getFriendList() {
    const userName = sessionStorage.getItem("userName");
    (this as any).$http
      .get("/chat/getFriendList", {
        userName,
      })
      .then((res: any) => {
        this.friends = res.friendList;
        this.id = this.friends[0];
        // 如果msgListObj是空对象的话就进行初始化，如果不是则从sessionStorage中获取
        if (Object.keys(this.msgListObj).length === 0) {
          for (const item of this.friends) {
            this.$set(this.msgListObj, item, []);
          }
        }
        this.msgList = this.msgListObj[this.id];
      });
  }
  /**
   * 设置好友列表的点击事件
   * chooseReciever
   */
  public chooseReciever(event: any) {
    const target = event.target || {};
    this.id = target.innerText;
    this.msgList = this.msgListObj[this.id];
  }
  public beforeDestroy() {
    // 销毁监听,实际操作中页面刷新时不会触发这个事件
    this.socket.onclose = this.close;
    this.$store.state.showNav = true;
  }
  public created() {
    this.$store.state.showNav = false;
    const data = sessionStorage.getItem("msgListObj");
    // 添加刷新事件，如果刷新，就将聊天记录存在sessionStorage中,由于只能存储键值对，需要将其序列化一下
    window.addEventListener("beforeunload", (e) => {
      sessionStorage.setItem("msgListObj", JSON.stringify(this.msgListObj));
    });
    // 刷新之后从sessionStorage读取聊天记录
    if (data !== null) {
      this.msgListObj = JSON.parse(data);
    }
    this.getFriendList();
    this.init();
  }
}
</script>

<style lang='scss'>
.chat-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  .myFriends {
    width: 25%;
    height: 100%;
    overflow-y: scroll;
    background: rgb(255, 255, 255);
    border-right: 2px solid rgb(206, 202, 202);
    .choice {
      height: 10vh;
      width: 100%;
    }
    .item {
      height: 10vh;
      border-bottom: 2px solid rgb(255, 255, 255);
      background: rgb(236, 234, 234);
      display: flex;
      .el-avatar {
        margin-top: 2.5%;
      }
      p {
        width: calc(100% - 60px);
        margin: 5px 0 0 10%;
      }
    }
  }
  .content {
    width: 75%;
    height: 100vh;
    position: relative;
    .nickName {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid rgb(190, 190, 190);
      background: rgb(241, 240, 240);
      position: absolute;
    }
    .mainContent {
      width: 100%;
      height: calc(95% - 165px);
      margin-top: 6%;
      overflow-y: scroll;
    }
    .edit {
      height: 115px;
      width: 97%;
      background: rgb(238, 238, 238);
      position: absolute;
      bottom: 0;
      padding: 10px;
      input {
        width: 97%;
        height: 45px;
        outline: none;
        font-size: 20px;
        text-indent: 10px;
        position: absolute;
        border-radius: 6px;
      }
      span {
        display: inline-block;
        width: 62px;
        height: 48px;
        background: #ccc;
        font-weight: 900;
        line-height: 45px;
        cursor: pointer;
        text-align: center;
        position: absolute;
        right: 10px;
        border-radius: 6px;
      }
      span:hover {
        color: #fff;
        background: #999;
      }
    }
  }
}
</style>