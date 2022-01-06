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
        :class="{ active: isActive[i] }"
        v-for="(item, i) in friends"
        :key="i"
        @click="chooseReciever($event, i)"
      >
        <el-avatar :src="avatarUrl"></el-avatar>
        <p>{{ item }}</p>
        <div class="infoNum" v-if="unreadMsg[item] > 0">
          {{ unreadMsg[item] }}
        </div>
      </div>
    </div>
    <div class="content">
      <div class="nickName">
        <p>{{ id }}</p>
      </div>
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
  // 接收者
  public id: string = "";
  // 搜索框的内容
  public value: string = "";
  // 发送的消息
  public inputValue: string = "";
  public path: string = "ws://localhost:3001?id=";
  public socket: any = {};
  // 好友列表
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
  public avatarUrl: string = require("@/assets/images/chat/avatar.svg");
  // 当前好友的聊天记录
  public msgList: any[] = [];
  // 本次会话中所有好友的聊天记录
  public msgListObj: any = {};
  // 未读的聊天记录数量
  public unreadMsg: any = {};
  // 设置好友列表的点击样式变化
  public isActive: boolean[] = [true];
  // 路由跳转之后聊天窗滚动到底部
  @Watch("$route")
  handle(newVal: any) {
    if (newVal.path === "/intercourse") {
      this.scrollToBottom();
    }
  }
  @Watch("msgListObj", { deep: true })
  handleWatch(val: any, oldVal: any) {
    this.msgList = this.msgListObj[this.id];
    this.scrollToBottom();
  }

  // 将输入的内容发送到服务器
  public async chat() {
    // 初始化
    if (this.inputValue === "") {
      this.$message({
        showClose: true,
        message: "不可发送空消息！",
        type: "warning",
      });
      return;
    }
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
        this.$store.state.isConnect = true;
      };
      // 监听socket错误信息
      this.socket.onerror = () => {
        console.log("连接错误");
      };
      // 监听socket消息
      this.socket.onmessage = (res: any) => {
        const data = JSON.parse(res.data);
        if (this.msgListObj[data.send_id] === undefined) {
          this.msgListObj[data.send_id] = [];
        }
        this.msgListObj[data.send_id].push(data);
        this.$store.state.unreadMsg++;
        this.unreadMsg[data.send_id]++;
        if (this.id === data.send_id) {
          this.unreadMsg[data.send_id] = 0;
        }
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
    let isFirst: boolean = true;
    (this as any).$http
      .get("/chat/getFriendList", {
        userName,
      })
      .then((res: any) => {
        this.friends = res.friendList;
        this.id = this.friends[0];
        // 如果msgListObj是空对象的话就进行初始化，如果不是则从sessionStorage中获取
        if (Object.keys(this.msgListObj).length === 0) {
          isFirst = true;
        } else isFirst = false;
        for (const item of this.friends) {
          if (isFirst) this.$set(this.msgListObj, item, []);
          // 标记未读消息的对象 键：好友 值：全部初始化为0
          this.$set(this.unreadMsg, item, 0);
        }
        this.msgList = this.msgListObj[this.id];
      });
  }
  /**
   * 设置好友列表的点击事件
   * chooseReciever
   */
  public chooseReciever(event: any, i: number) {
    this.id = this.friends[i];
    this.msgList = this.msgListObj[this.id];
    this.unreadMsg[this.id] = 0;
    for (let key = 0; key < this.friends.length; key++) {
      this.isActive[key] = key === i ? true : false;
    }
    this.scrollToBottom();
  }
  public beforeDestroy() {
    // 销毁监听,实际操作中页面刷新时不会触发这个事件
    this.socket.onclose = this.close;
  }
  public async mounted() {
    const data = sessionStorage.getItem("msgListObj");
    const that = this;
    // 添加路由跳转事件、刷新事件，如果刷新，就将聊天记录存在sessionStorage中,由于只能存储键值对，需要将其序列化一下
    ["beforeunload"].forEach((item, index) => {
      window.addEventListener(item, () => {
        sessionStorage.setItem("msgListObj", JSON.stringify(that.msgListObj));
        that.scrollToBottom();
      });
    });
    // 刷新之后从sessionStorage读取聊天记录
    if (data !== null) {
      this.msgListObj = JSON.parse(data);
    }
    await this.getFriendList();
    this.init();
  }
  private scrollToBottom() {
    setTimeout(() => {
      // 拿到目标节点
      const container = this.$el.querySelector(".mainContent");
      // @ts-ignore
      container.scrollTop = container.scrollHeight;
    }, 30);
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
    overflow-y: auto;
    background: rgb(255, 255, 255);
    border-right: 2px solid rgb(206, 202, 202);
    .choice {
      height: 10vh;
      width: 100%;
    }
    .active {
      background: rgb(190, 190, 190) !important;
    }
    .item {
      position: relative;
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
      .infoNum {
        position: absolute;
        top: 2.5%;
        left: 24px;
        background: rgb(255, 0, 0);
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        color: #fff;
        text-align: center;
        border-radius: 50%;
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
      position: relative;
      p {
        margin: 0 0 0 3%;
        padding-top: 1%;
      }
    }
    .mainContent {
      width: 100%;
      height: calc(100% - 165px);
      overflow-y: auto;
    }
    .edit {
      height: 115px;
      width: 100%;
      background: rgb(238, 238, 238);
      position: absolute;
      bottom: 0;
      input {
        width: 99%;
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
        right: 2px;
        top: 1px;
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