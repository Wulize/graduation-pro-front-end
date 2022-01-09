<template>
  <div class="chat-wrapper">
    <div class="myFriends">
      <div class="userInfo">
        <div class="userName">
          <el-avatar :src="avatarUrl[1]" title="编辑个人信息"></el-avatar>
          <p>{{ userName }}</p>
        </div>
        <div class="addSign" @click="addFriend">
          <el-avatar
            :src="avatarUrl[2]"
            id="addSign"
            shape="square"
            title="点击添加好友"
          ></el-avatar>
        </div>
      </div>
      <el-select
        class="choice"
        v-model="value"
        filterable
        @change="findfriend"
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
        :class="{ active: isActive[i] }"
        :key="i"
        @click="chooseReciever(i)"
      >
        <el-avatar :src="avatarUrl[0]"></el-avatar>
        <p>{{ item }}</p>
        <div class="infoNum" v-if="unreadMsg[item] > 0">
          {{ unreadMsg[item] }}
        </div>
        <div class="isOnline">
          <span v-if="onlineFriend.includes(item)">在线</span>
          <span v-else>离线</span>
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
    <addfriend
      :isShow="isShow"
      @cancle="handleCancle"
      @confirm="handleConfirm"
    ></addfriend>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import addfriend from "../components/Intercourse/addfriend.vue";
@Component({
  components: { addfriend },
})
export default class Intercourse extends Vue {
  // 添加好友弹窗
  public isShow: boolean = false;
  public userName: string = "";
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
  // 在线好友
  public onlineFriend: string[] = [];
  public options: any[] = [];
  public avatarUrl: string[] = [
    `${require("@/assets/images/chat/avatar.svg")}`,
    `${require("@/assets/images/chat/cat.svg")}`,
    `${require("@/assets/images/chat/add.svg")}`,
  ];
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
    if (this.id === "请先添加好友") {
      this.$message({
        showClose: true,
        message: "找个好友聊天去吧，单身狗！",
        type: "warning",
      });
      return;
    } else if (this.inputValue === "") {
      this.$message({
        showClose: true,
        message: "不可发送空消息！",
        type: "warning",
      });
      return;
    }
    const info: any = {
      type: "chat",
      send_time: new Date(),
      send_msg: this.inputValue,
      send_id: this.userName,
      send_name: this.userName,
      receiver: this.id,
    };
    // 发送后跳到第一个记录
    this.friends.unshift(
      ...this.friends.splice(this.friends.indexOf(this.id), 1)
    );
    // 发送信息后，对应的聊天跳到第一个记录，样式也相应改变
    this.isActive.forEach((item: boolean, index: number) => {
      this.isActive[index] = index === 0 ? true : false;
    });
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
      this.socket = new WebSocket(this.path + this.userName);
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
        // 好友在线信息
        if (data.type === "isOnline") {
          this.onlineFriend = data.onlineFriend;
        }
        // 聊天信息
        else if (data.type === "chat") {
          if (this.msgListObj[data.send_id] === undefined) {
            this.msgListObj[data.send_id] = [];
          }
          this.msgListObj[data.send_id].push(data);
          this.$store.state.unreadMsg++;
          this.unreadMsg[data.send_id]++;
          if (this.id === data.send_id) {
            this.unreadMsg[data.send_id] = 0;
          }
          // 接收消息后跳到第一个记录
          this.friends.unshift(
            ...this.friends.splice(this.friends.indexOf(data.send_id), 1)
          );
          // 接受信息后，对应的聊天跳到第一个记录，样式需要满足当前id
          this.isActive.forEach((item: boolean, index: number) => {
            this.isActive[index] =
              this.friends[index] === this.id ? true : false;
          });
        }
        // 新增好友信息
        else if (data.type === "add" && data.send_name !== "机器人代发") {
          this.$confirm(
            `是否添加${data.send_name}为好友?
          备注信息：${data.send_msg}`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              (this as any).$http
                .get("/chat/addFriend", {
                  userName: this.userName,
                  friend: data.send_name,
                })
                .then((response: any) => {
                  if (response.code) {
                    if (this.friends.indexOf(data.send_name) === -1) {
                      this.friends.unshift(data.send_name);
                      this.$set(this.msgListObj, data.send_name, []);
                      const index = this.friends.indexOf(this.id);
                      this.chooseReciever(index);
                    }
                    this.$message({
                      type: "success",
                      message: "添加成功",
                    });
                  } else {
                    throw new Error("添加好友失败");
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已拒绝",
              });
            });
        }
        // 对方统一添加之后更新好友列表
        else if (data.type === "renewList") {
          if (this.friends.indexOf(data.newFriend) === -1) {
            this.friends.unshift(data.newFriend);
            this.$set(this.msgListObj, data.newFriend, []);
            const index = this.friends.indexOf(this.id);
            this.chooseReciever(index);
          }
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
  public getFriendList(callBack: () => void) {
    const userName = sessionStorage.getItem("userName");
    // let isFirst: boolean = true;
    (this as any).$http
      .get("/chat/getFriendList", {
        userName,
      })
      .then((res: any) => {
        this.friends = res.friendList;
        this.id = this.friends[0];
        for (const item of this.friends) {
          // 这里是防止出现新的好友时，聊天记录没地儿保存，所以如果好友记录不存在，就把他设置成【】
          if (!this.msgListObj[item]) this.$set(this.msgListObj, item, []);
          // 标记未读消息的对象 键：好友 值：全部初始化为0
          this.$set(this.unreadMsg, item, 0);
          this.options.push({
            value: item,
            label: item,
          });
        }
        this.msgList = this.msgListObj[this.id];
        callBack();
      });
  }
  /**
   * 设置好友列表的点击事件
   * chooseReciever
   */
  public chooseReciever(i: number) {
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
  public async created() {
    this.userName = sessionStorage.getItem("userName") || "";
    const data = localStorage.getItem("msgListObj");
    const that = this;
    // 添加路由跳转事件、刷新事件，如果刷新，就将聊天记录存在sessionStorage中,由于只能存储键值对，需要将其序列化一下
    ["beforeunload"].forEach((item, index) => {
      window.addEventListener(item, () => {
        localStorage.setItem("msgListObj", JSON.stringify(that.msgListObj));
        that.scrollToBottom();
      });
    });
    // 刷新之后从sessionStorage读取聊天记录
    if (data !== null) {
      this.msgListObj = JSON.parse(data);
    }
    // 出错原因是this.getgetFriendList没执行完，就执行了init，导致一些变量还没有初始化好
    // await this.getFriendList();
    // await this.init();
    this.getFriendList(this.init);
  }
  private scrollToBottom() {
    setTimeout(() => {
      // 拿到目标节点
      const container = this.$el.querySelector(".mainContent");
      // @ts-ignore
      container.scrollTop = container.scrollHeight;
    }, 30);
  }
  // 好友聊天查找框的change事件
  public findfriend(name: string) {
    const index = this.friends.indexOf(name);
    this.chooseReciever(index);
    this.value = "";
  }
  // 添加好友
  public addFriend() {
    this.isShow = true;
  }
  // 添加好友取消事件
  public handleCancle() {
    this.isShow = false;
  }
  // 确认添加好友
  public handleConfirm(info: any) {
    this.isShow = false;
    info.send_id = this.userName;
    info.send_time = new Date();
    info.send_name = this.userName;
    this.send(JSON.stringify(info));
  }
}
</script>

<style lang='scss'>
.chat-wrapper {
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  .myFriends {
    width: 25%;
    height: 100%;
    overflow-y: auto;
    background: rgb(255, 255, 255);
    border-right: 2px solid rgb(206, 202, 202);
    .userInfo {
      position: relative;
      display: flex;
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      .userName {
        display: flex;
        align-items: center;
        justify-content: center;
        p {
          margin: 0 0 0 10px;
          line-height: 50px;
        }
      }
      #addSign {
        height: 30px;
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 2px;
        bottom: 50%;
        transform: translateY(50%);
      }
    }
    .choice {
      height: 6vh;
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
      .isOnline {
        position: absolute;
        right: 1px;
        bottom: 6px;
        width: 30px;
        height: 10px;
        line-height: 10px;
        font-size: 10px;
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
        line-height: 50px;
        font-size: 20px;
      }
    }
    .mainContent {
      width: 100%;
      height: calc(100% - 165px);
      overflow-y: auto;
      .msg {
        margin-left: 1%;
      }
    }
    .edit {
      height: 115px;
      width: 100%;
      background: rgb(238, 238, 238);
      position: absolute;
      bottom: 0;
      input {
        width: 99.2%;
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