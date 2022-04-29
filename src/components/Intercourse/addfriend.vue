<template>
  <div class="shade" v-if="isShow">
    <div class="addfriend">
      <div class="select">
        请输入好友昵称：
        <el-select
          v-model="value"
          filterable
          remote
          reserve-keyword
          placeholder="搜索"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="{ val: item.label, label: item.value }"
          >
          </el-option>
        </el-select>
      </div>
      <div class="search-result">
        <div class="res">
          搜索结果：{{ value.val }}
          <el-avatar
            v-if="value.label"
            :src="value.label"
            shape="square"
          ></el-avatar>
        </div>
        <div class="message">
          验证信息：<el-input
            type="textarea"
            :rows="2"
            maxlength="250"
            show-word-limit
            placeholder="请输入内容"
            v-model="textarea"
          >
          </el-input>
        </div>
      </div>
      <div class="buttons">
        <el-button @click="cancle">取消</el-button>
        <el-button @click="confirm" type="primary">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class AddFriend extends Vue {
  @Prop() public isShow: boolean = false;
  public options: any[] = [];
  public value: any = {};
  public list: any[] = [];
  public loading: boolean = false;
  public friend: string = "";
  public textarea: string = "";
  // 查找事件
  public remoteMethod(query: string) {
    if (query !== "") {
      const userName = sessionStorage.getItem("userName");
      this.loading = true;
      this.options = [];
      // getMatchFriends
      (this as any).$http
        .get("/chat/getMatchFriends", { id: query, userName })
        .then((res: any) => {
          (res.friends || []).forEach((element: any) => {
            this.options.push({
              value: element.avatarUrl,
              label: element.userName,
            });
          });
          this.loading = false;
          console.log(this.options);
        });
    }
  }
  // 取消按钮
  public cancle() {
    this.$emit("cancle");
    this.value = {};
    this.options = [];
    this.textarea = "";
  }
  public confirm() {
    if (!this.value.val) {
      alert("请选择一名用户");
      this.value = {};
      this.options = [];
      this.textarea = "";
      return;
    }
    this.$emit("confirm", {
      receiver: this.value.val,
      send_msg: this.textarea,
      type: "add",
    });
    this.value = {};
    this.options = [];
    this.textarea = "";
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
  // display: none;
}
.addfriend {
  border-radius: 1.5rem;
  z-index: 2;
  width: 450px;
  height: 400px;
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-60%);
  .select {
    display: flex;
    flex-direction: flex-start;
    align-items: center;
    margin-left: 10px;
    height: 50px;
    margin-top: 10px;
    .el-select .el-input .el-input__inner {
      border-color: #a1a1a1;
      border-radius: 1rem;
    }
  }
  .search-result {
    height: 280px;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    align-items: flex-start;
    .res {
      margin-top: 15px;
      line-height: 60px;
      display: flex;
      align-items: center;
      .el-avatar {
        margin: 0 2rem;
      }
    }
    .message {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      width: 425px;
      height: 149px;
      .el-textarea__inner {
        margin-top: 20px;
        height: 120px;
      }
    }
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 50px;
  }
}
</style>
