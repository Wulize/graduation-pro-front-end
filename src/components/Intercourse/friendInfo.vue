<template>
  <div class="shade" v-if="isShow">
    <div class="friendInfo">
      <div class="baseInfo">
        <div class="name">好友昵称: &nbsp;&nbsp;&nbsp;&nbsp;{{ friendId }}</div>
        <el-avatar :src="avatarUrl" shape="square"></el-avatar>
      </div>
      <div class="hori-line"></div>
      <div class="otherInfo">
        <div class="email">email: &nbsp;&nbsp;&nbsp;&nbsp;{{ email }}</div>
        <div class="tag">个人宣言: &nbsp;&nbsp;&nbsp;&nbsp;暂无相关介绍</div>
      </div>
      <div class="hori-line"></div>
      <div class="buttons">
        <el-button @click="cancle">返回</el-button>
        <el-button @click="confirm" type="danger">删除好友</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class AddFriend extends Vue {
  @Prop({ default: false }) public isShow: boolean = false;
  @Watch("isShow")
  handle(newval: boolean) {
    if (newval === true) {
      (this as any).$http
        .get("/chat/getfriendInfo", {
          friend: this.friendId,
        })
        .then((response: any) => {
          this.email = (response.info || {}).email;
          this.avatarUrl = (response.info || {}).avatarUrl;
        });
    }
  }
  @Prop({}) public friendId: string = "";
  public avatarUrl: string = "";
  public email: string = "";
  // 取消按钮
  public cancle() {
    this.$emit("cancle");
  }
  public confirm() {
    (this as any).$http
      .get("/chat/deleteFriend", {
        friend: this.friendId,
      })
      .then((response: any) => {
        this.$message({
          showClose: true,
          message: `${response.info}`,
          type: "success",
        });
        this.$emit("deleteFriend");
      });
  }
}
</script>
<style lang="scss">
.shade {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(200, 200, 200, 0.6);
  z-index: 1;
  .friendInfo {
    border-radius: 1.5rem;
    z-index: 2;
    width: 450px;
    height: 400px;
    position: absolute;
    display: flex;
    flex-direction: column;
    background: #f0f0f0;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-60%);
    .hori-line {
      width: 90%;
      margin-left: 5%;
      height: 1px;
      border-top: solid #d8d7d7;
    }
    .baseInfo {
      margin: 2rem 0 2rem 2rem;
      height: 60px;
      display: flex;
      align-items: center;
      .name {
        margin-right: 4rem;
      }
    }
    .otherInfo {
      margin: 0 0 1rem 2rem;
      .email {
        margin-bottom: 1.5rem;
        margin-top: 1rem;
      }
    }
    .buttons {
      width: 100%;
      margin-top: 6rem;
      line-height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>