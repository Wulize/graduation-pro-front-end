<template>
  <div class="chat-wrapper">
    <div class="myFriends">
      <div class="userInfo">
        <div class="userName" @click="openEditInfo">
          <el-avatar :src="myAvatarUrl" title="编辑个人信息"></el-avatar>
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
        <div class="userInfo">
          <el-avatar :src="item.avatarUrl || avatarUrl[0]"></el-avatar>
          <p>{{ item.friendName }}</p>
        </div>
        <p class="lastInfo">
          {{
            !(
              (msgListObj[item.friendName] || [])[
                (msgListObj[item.friendName] || []).length - 1
              ] || {}
            ).msgType === true
              ? (
                  (msgListObj[item.friendName] || [])[
                    (msgListObj[item.friendName] || []).length - 1
                  ] || {}
                ).send_msg
              : "暂不支持显示此数据类型"
          }}
        </p>
        <div class="infoNum" v-if="unreadMsg[item.friendName] > 0">
          {{ unreadMsg[item.friendName] }}
        </div>
        <div class="isOnline">
          <span v-if="onlineFriend.includes(item.friendName)">在线</span>
          <span v-else>离线</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="nickName">
        <p>{{ id }}</p>
      </div>
      <div class="mainContent">
        <div class="msg">
          <ul>
            <li v-for="(item, key) in msgList" :key="key">
              <p class="time"><span v-text="item.send_time"></span></p>
              <div
                class="infoItem"
                :class="item.send_id == userName ? 'msg-right' : 'msg-left'"
              >
                <el-avatar
                  :src="item.send_id == userName ? myAvatarUrl : friendUrl"
                  title="查看好友信息"
                  shape="square"
                ></el-avatar>
                <div
                  :class="item.send_id == userName ? 'text-right' : 'text-left'"
                >
                  <span class="span-left"></span>
                  <p v-if="!item.msgType">{{ item.send_msg }}</p>
                  <img
                    :src="item.send_msg"
                    style="max-width: 200px; max-height: 200px"
                    v-if="item.msgType === '1'"
                    @click="imgClick"
                  />
                  <div
                    ref="audio"
                    v-if="item.msgType === '2'"
                    @click="broadcast($event)"
                  >
                    <span>点击查看语音消息</span>
                    <audio
                      preload="auto"
                      hidden="true"
                      @ended="onBroadcastEnd($event)"
                    >
                      <source
                        :src="
                          base64ToBlob(item.send_msg) === ''
                            ? ''
                            : createObjectURL(base64ToBlob(item.send_msg))
                        "
                      />
                    </audio>
                  </div>

                  <span class="span-right"></span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="edit">
        <div class="icon">
          <div @click="sendPic">
            <el-avatar :src="avatarUrl[3]" title="发送本地图片"></el-avatar>
          </div>
          <div>
            <el-avatar :src="avatarUrl[4]" title="发送本地文件"></el-avatar>
          </div>
          <div @mousedown="startRecord" @mouseup="stopRecord">
            <el-avatar :src="avatarUrl[5]" title="发送语音"></el-avatar>
          </div>
        </div>
        <!-- 添加输入内容 -->
        <el-input
          id="text"
          type="textarea"
          placeholder=""
          v-model="inputValue"
          @keyup.enter.native="chat"
          autofocus
        >
        </el-input>
        <!-- 给发送也绑定一个事件 -->
        <span id="btn" @click="chat">发送(S)</span>
      </div>
    </div>
    <addfriend
      :isShow="isShow"
      @cancle="handleCancle"
      @confirm="handleConfirm"
    ></addfriend>
    <editMyInfo :isShow="editInfoShow" @close="closeEditInfo"></editMyInfo>
    <!-- 点击查看大图 -->
    <pictureBoost
      :pictureBoostShow="pictureBoostShow"
      :imgData="imgData"
      @picBoostClose="picBoostClose"
    ></pictureBoost>
    <!-- 提交图片 -->
    <el-upload
      style="position: absolute; display: none"
      action="#"
      :on-change="handleChangeUpload"
      :on-success="uploadSuccess"
      ref="upload"
      list-type="picture-card"
      :auto-upload="false"
    >
    </el-upload>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import addfriend from "../components/Intercourse/addfriend.vue";
import editMyInfo from "../components/Intercourse/personalInfo.vue";
import pictureBoost from "../components/Intercourse/picture-boost.vue";
import Recorderx, { ENCODE_TYPE } from "recorderx";
import { blobToBase64, base64ToBlob } from "@/utils/blobToBase64";
@Component({
  components: { addfriend, editMyInfo, pictureBoost },
})
export default class Intercourse extends Vue {
  // 正在播放的节点
  public brocastNode: any;
  public rc: any = new Recorderx();
  public audioaccet: boolean = false;
  public statusaudio: boolean = false;
  // 点击聊天记录查看大图组件
  public pictureBoostShow: boolean = false;
  public imgData: string = "";
  // 个人头像地址
  public myAvatarUrl: string =
    sessionStorage.getItem("avatarUrl") ||
    `${require("@/assets/images/chat/cat.svg")}`;
  // 添加好友弹窗
  public isShow: boolean = false;
  // 编辑个人信息弹窗
  public editInfoShow: boolean = false;
  public userName: string = "";
  // 好友列表
  public friends: any[] = [{ friendName: "请先添加好友", avatarUrl: "" }];
  // 接收者
  public id: string = "请先添加好友";
  @Watch("id", { immediate: true })
  handleIdChange(newVal: string) {
    this.friendUrl =
      this.friends.find((item) => item.friendName === newVal).avatarUrl ||
      `${require("@/assets/images/chat/avatar.svg")}`;
  }
  // 接收者头像Url
  public friendUrl: string = "";
  // 搜索框的内容
  public value: string = "";
  // 发送的消息
  public inputValue: string = "";
  public path: string = "ws://localhost:3001?id=";
  public socket: any = {};
  // 在线好友
  public onlineFriend: string[] = [];
  public options: any[] = [];
  public avatarUrl: string[] = [
    `${require("@/assets/images/chat/avatar.svg")}`,
    `${require("@/assets/images/chat/cat.svg")}`,
    `${require("@/assets/images/chat/add.svg")}`,
    `${require("@/assets/images/chat/photo.svg")}`,
    `${require("@/assets/images/chat/file.svg")}`,
    `${require("@/assets/images/chat/voice.svg")}`,
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
      send_time: new Date().toLocaleString(),
      send_msg: this.inputValue,
      send_id: this.userName,
      send_name: this.userName,
      receiver: this.id,
    };
    // 发送后跳到第一个记录
    const index = this.friends.findIndex((item) => {
      return item.friendName === this.id;
    });
    this.friends.unshift(...this.friends.splice(index, 1));
    // 发送信息后，对应的聊天跳到第一个记录，样式也相应改变
    this.isActive.forEach((item: boolean, ind: number) => {
      this.isActive[ind] = !Boolean(ind);
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
          const index = this.friends.findIndex(
            (item) => item.friendName === data.send_id
          );
          this.friends.unshift(...this.friends.splice(index, 1));
          // 接受信息后，对应的聊天跳到第一个记录，样式需要满足当前id
          for (let key = 0; key < this.friends.length; key++) {
            this.isActive[key] =
              this.id === this.friends[key].friendName ? true : false;
          }
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
                    let index = this.friends.findIndex(
                      (item) => item.friendName === data.send_name
                    );
                    if (index === -1) {
                      this.friends.unshift({ friendName: data.send_name });
                      if (response.online)
                        this.onlineFriend.push(data.send_name);
                      this.$set(this.msgListObj, data.send_name, []);
                      index = this.friends.findIndex(
                        (item) => item.friendName === data.send_name
                      );
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
        // 对方同意添加之后更新好友列表
        else if (data.type === "renewList") {
          let index = this.friends.findIndex(
            (item) => item.friendName === data.send_name
          );
          if (index === -1) {
            this.friends.unshift(data.newFriend);
            this.onlineFriend.push(data.newFriend.friendName);
            this.$set(this.msgListObj, data.newFriend.friendName, []);
            index = this.friends.findIndex(
              (item) => item.friendName === data.send_name
            );
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
        this.id = this.friends[0].friendName;
        for (const item of this.friends) {
          // 这里是防止出现新的好友时，聊天记录没地儿保存，所以如果好友记录不存在，就把他设置成【】
          if (!this.msgListObj[item.friendName])
            this.$set(this.msgListObj, item.friendName, []);
          // 标记未读消息的对象 键：好友 值：全部初始化为0
          this.$set(this.unreadMsg, item.friendName, 0);
          this.options.push({
            value: item.friendName,
            label: item.friendName,
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
    this.id = this.friends[i].friendName;
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
    // 获取麦克风权限
    this.rc
      .start()
      .then(() => {
        this.rc.pause();
        this.rc.clear();
        this.audioaccet = true;
        this.$message({
          message: "获取麦克风成功",
          type: "success",
        });
      })
      .catch((error: any) => {
        this.$message({
          message: "获取麦克风失败",
          type: "warning",
        });
      });
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
    const index = this.friends.findIndex((item) => item.friendName === name);
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
  // 关闭编辑信息弹窗
  public closeEditInfo() {
    console.log("组件关闭");
    this.editInfoShow = false;
  }
  // 打开编辑信息弹窗
  public openEditInfo() {
    console.log("组件打开");
    this.editInfoShow = true;
  }
  public sendPic() {
    console.log("点击发送图片");
    // console.log(this.$refs.upload);

    (this.$refs.upload as any).$children[1].$refs.input.click();
  }
  // 获取图片的值
  public handleChangeUpload(file: any, fileList: any) {
    this.getBase64(file.raw).then((res) => {
      // 初始化
      if (this.id === "请先添加好友") {
        this.$message({
          showClose: true,
          message: "找个好友聊天去吧，单身狗！",
          type: "warning",
        });
        return;
      }
      const info: any = {
        type: "chat",
        msgType: "1",
        send_time: new Date().toLocaleString(),
        send_msg: res,
        send_id: this.userName,
        send_name: this.userName,
        receiver: this.id,
      };
      // 发送后跳到第一个记录
      const index = this.friends.findIndex((item) => {
        return item.friendName === this.id;
      });
      this.friends.unshift(...this.friends.splice(index, 1));
      // 发送信息后，对应的聊天跳到第一个记录，样式也相应改变
      this.isActive.forEach((item: boolean, ind: number) => {
        this.isActive[ind] = !Boolean(ind);
      });
      this.inputValue = "";
      this.msgListObj[this.id].push(info);
      this.send(JSON.stringify(info));
    });
  }
  // 聊天图片发送成功之后的回调
  public uploadSuccess(data: any) {
    (this.$refs.upload as any).clearFiles();
  }
  public getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let imgResult: any = "";
      reader.readAsDataURL(file);
      reader.onload = () => {
        imgResult = reader.result;
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.onloadend = () => {
        resolve(imgResult);
      };
    });
  }
  // 点击聊天图片放大操作
  public imgClick(event: any) {
    this.pictureBoostShow = true;
    this.imgData = event.srcElement.currentSrc;
  }
  public picBoostClose() {
    this.pictureBoostShow = false;
  }
  // 开始录音
  public startRecord() {
    this.$message({
      showClose: true,
      message: "开始录音，松开按钮结束录音！",
      type: "success",
    });
    this.rc
      .start()
      .then((res: any) => {
        console.log("start recording");
      })
      .catch((error: any) => {
        console.log("Recording failed.", error);
      });
  }
  // 结束录音
  public stopRecord() {
    this.$message({
      showClose: true,
      message: "录音完成！",
      type: "success",
    });
    this.statusaudio = true;
    this.rc.pause();
    this.sendRecord();
  }
  // 发送录音
  public async sendRecord() {
    // 获取录音的blob文件
    const wav = this.rc.getRecord({
      encodeTo: ENCODE_TYPE.WAV,
      compressible: true,
    });
    // 将blob修改成base64编码
    const recordData: string = String(await blobToBase64(wav));
    if (this.id === "请先添加好友") {
      this.$message({
        showClose: true,
        message: "找个好友聊天去吧，单身狗！",
        type: "warning",
      });
      this.rc.clear();
      this.statusaudio = false;
      return;
    }
    const info: any = {
      type: "chat",
      msgType: "2",
      send_time: new Date().toLocaleString(),
      send_msg: recordData,
      send_id: this.userName,
      send_name: this.userName,
      receiver: this.id,
    };
    // 发送后跳到第一个记录
    const index = this.friends.findIndex((item) => {
      return item.friendName === this.id;
    });
    this.friends.unshift(...this.friends.splice(index, 1));
    // 发送信息后，对应的聊天跳到第一个记录，样式也相应改变
    this.isActive.forEach((item: boolean, ind: number) => {
      this.isActive[ind] = !Boolean(ind);
    });
    this.inputValue = "";
    this.msgListObj[this.id].push(info);
    this.send(JSON.stringify(info));
    this.rc.clear();
    this.statusaudio = false;
  }

  // 播放音频
  public broadcast(event: any) {
    // 判断当前是否有音频正在播放
    if (this.brocastNode) {
      // 暂停
      this.brocastNode.pause();
      // 将时间定位到0s的位置
      this.brocastNode.currentTime = 0;
    }
    // 获取audio节点
    const audio = event.path[1].children[1];
    this.brocastNode = audio;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }
  // 音频播放结束
  public onBroadcastEnd(event: any) {
    console.log("音频播放结束");
    // 播放结束就不记录当前节点，另其值等于undefined
    if (this.brocastNode === event.path[1].children[1]) {
      this.brocastNode = undefined;
    }
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
      min-height: 94px;
      border-bottom: 2px solid rgb(255, 255, 255);
      background: rgb(236, 234, 234);
      display: flex;
      flex-direction: column;
      .userInfo {
        display: flex;
      }
      .lastInfo {
        font-size: 13px;
        color: #757575;
        padding-left: 40px;
        width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
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
      height: calc(100% - 250px);
      overflow-y: auto;
      background: #f4f4f4;
      .msg {
        margin-left: 1%;
        li {
          list-style-type: none;
          margin-bottom: 70px;
          .infoItem {
            display: flex;
            flex-direction: row;
            p {
              margin: 0;
            }
          }
          .msg-right {
            margin-right: 3%;
            float: right;
            flex-direction: row-reverse;
          }
          .msg-left {
            float: left;
          }
          .text-left {
            display: flex;
            position: relative;
            word-break: break-all;
            padding: 0 10px 0 10px;
            min-height: 40px;
            font-size: 15px;
            border-radius: 7px;
            max-width: 300px;
            margin-left: 20px;
            margin-bottom: 20px;
            background: rgb(255, 255, 255);
            line-height: 40px;
            img {
              margin-bottom: 10px;
              margin-top: 10px;
            }
            .span-left {
              position: absolute;
              right: 100%;
              top: 12px;
              width: 0;
              height: 0;
              line-height: 0;
              font-size: 0;
              border: 7px solid transparent;
              border-right-color: rgb(255, 255, 255);
            }
          }
          .text-right {
            display: flex;
            position: relative;
            word-break: break-all;
            padding: 0 10px 0 10px;
            border-radius: 7px;
            min-height: 40px;
            max-width: 300px;
            font-size: 15px;
            margin-bottom: 20px;
            margin-right: 20px;
            background: #9eea6a;
            line-height: 40px;
            img {
              margin-bottom: 10px;
              margin-top: 10px;
            }
            .span-right {
              position: absolute;
              right: -12px;
              top: 12px;
              width: 0;
              height: 0;
              line-height: 0;
              font-size: 0;
              border: 6px solid transparent;
              border-left-color: #9eea6a;
            }
          }
        }
        .time {
          display: flex;
          width: 100%;
          justify-content: center;
          span {
            padding: 0 5px;
            font-size: 12px;
            color: #fff;
            border-radius: 2px;
            background-color: #dadada;
          }
        }
      }
    }
    .edit {
      height: 200px;
      width: 100%;
      background: rgb(255, 255, 255);
      position: relative;
      bottom: 0;
      .icon {
        height: 35px;
        margin-top: 5px;
        display: flex;
        justify-content: flex-start;
        background: white;
        .el-avatar {
          background: white;
          height: 30px;
          width: 30px;
          margin-left: 30px;
        }
      }
      .el-textarea {
        width: 100%;
        outline: none;
        font-size: 20px;
        text-indent: 10px;
        position: absolute;
        .el-textarea__inner {
          height: 160px !important;
          border: none;
          // background-image: url("C:\\Users\\wulize\\Desktop\\毕业设计论文\\img\\1.png");
        }
      }
      #btn {
        display: inline-block;
        width: 62px;
        height: 25px;
        background: #d8d8d8;
        font-weight: 500;
        line-height: 25px;
        cursor: pointer;
        text-align: center;
        position: absolute;
        right: 30px;
        bottom: 10px;
      }
      #btn:hover {
        color: #fff;
        background: #999;
      }
    }
  }
}
</style>