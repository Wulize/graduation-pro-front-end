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
      <div class="item" v-for="(item, i) in friends" :key="i">
        <el-avatar>lize</el-avatar>
        <p>lize</p>
      </div>
    </div>
    <div class="content">
      <div class="nickName">{{ id }}</div>
      <div class="mainContent">
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
        <div>1111111</div>
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
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Intercourse extends Vue {
  public id: string = this.$store.state.userName;
  public value: string = "";
  public inputValue: string = "";
  public path: string = "ws://localhost:3001?id=";
  public socket: any = {};
  public friends: string[] = [
    "lize",
    "yx",
    "lx",
    "baozi",
    "yx",
    "lx",
    "baozi",
    "yx",
    "lx",
    "baozi",
  ];
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
  // 将输入的内容发送到服务器
  public async chat() {
    // 初始化
    console.log(this.id);
    const info: any = {
      type: "chat",
      send_time: new Date(),
      user: {
        send_msg: this.inputValue,
        uid: "111",
        uname: "lize",
        uimg: null,
      },
      receiver: {
        uid: "wulize",
      },
    };

    this.send(JSON.stringify(info));
  }
  // 初始化websocket相关配置
  private init() {
    if (typeof WebSocket === "undefined") {
      alert("您的浏览器不支持socket");
    } else {
      // 实例化socket
      this.socket = new WebSocket(this.path + this.id);
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
        console.log(res);
        alert("您收到的消息是：" + data.msg);
      };
    }
  }
  public send(params: any) {
    this.socket.send(params);
  }
  public close() {
    console.log("socket已经关闭");
  }
  public beforeDestroy() {
    // 销毁监听
    this.socket.onclose = this.close;
  }
  public created() {
    console.log("初始化");
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