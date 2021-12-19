<template>
  <div class="login-wrapper">
    <!-- 注册页图片 -->
    <div class="image-wrapper">
      <img src="@/assets/images/register/register01.jpg" />
    </div>
    <!-- 注册页输入 -->
    <div class="input-wrapper">
      <div class="email-wrapper">
        <el-input
          v-model="userEmail"
          placeholder="请输入您的邮箱"
          class="user-input"
        ></el-input>
        <div class="input-tips"></div>
      </div>
      <div class="name-wrapper">
        <el-input
          v-model="userName"
          placeholder="请输入您的用户名"
          class="user-input"
        ></el-input>
        <div class="input-tips"></div>
      </div>
      <div class="password-wrapper">
        <el-input
          v-model="userCode1"
          placeholder="请输入您的密码"
          showPassword
          class="user-input"
        ></el-input>
        <div class="input-tips"></div>
      </div>
      <div class="password-wrapper">
        <el-input
          v-model="userCode2"
          placeholder="请再次输入您的密码"
          showPassword
          class="user-input"
        >
        </el-input>
        <div class="input-tips"></div>
      </div>
      <div class="code-wrapper">
        <el-input
          v-model="userValidation"
          placeholder="请输入验证码"
          class="user-input"
        ></el-input>
        <el-button
          type="primary"
          class="validation-code"
          @click="getValidation"
          :disabled="ifValidationForbidden"
          >{{ validationMessage }}</el-button
        >
      </div>
      <div class="confirm-wrapper">
        <el-button type="primary" class="confirm" :disabled="ifConfirmForbidden"
          >确定</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
@Component
export default class Register extends Vue {
  userName = "";
  userEmail = "";
  userCode1 = "";
  userCode2 = "";
  userValidation = ""; // 用户输入验证码
  validationMessage = "获取验证码"; // 获取验证码按钮的显示信息
  // 未点击前：获取验证码
  // 点击后：倒计时
  countDown = 60; // 倒计时
  ifConfirmForbidden = true; // 是否禁用确定按钮
  ifValidationForbidden = false; // 是否禁用获取验证码按钮
  getValidation() {
    this.ifConfirmForbidden = false;
    this.ifValidationForbidden = true;
    this.validationMessage = this.countDown + "s";
    axios({
      method: "get",
      url: "http://localhost:3000/users/email",
      withCredentials: true,
      params: {
        user_name: this.userName,
        email: this.userEmail,
      },
    });
    this.getCountDown();
  }
  getCountDown() {
    // 获取倒计时
    if (this.countDown === 0) {
      return;
    } else {
      setTimeout(() => {
        this.countDown--;
        this.validationMessage = this.countDown + "s";
        this.getCountDown();
      }, 1000);
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  .image-wrapper {
    width: 50%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .input-wrapper {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
    height: 100%;
    text-align: center;
    div {
      margin-top: 1%;
      .user-input {
        width: 50%;
      }
    }
    .code-wrapper {
      .validation-code {
        width: 20%;
      }
      .user-input {
        width: 30%;
      }
    }
    .confirm-wrapper {
      margin-top: 3.2%;
      .confirm {
        width: 50%;
      }
    }
  }
}
</style>