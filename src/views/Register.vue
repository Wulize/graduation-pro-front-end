<template>
  <div class="login-wrapper">
    <el-input v-model="userEmail" placeholder="请输入您的邮箱"></el-input>
    <el-input v-model="userName" placeholder="请输入您的用户名"></el-input>
    <el-input
      v-model="userCode1"
      placeholder="请输入您的密码"
      showPassword
    ></el-input>
    <el-input
      v-model="userCode2"
      placeholder="请再次输入您的密码"
      showPassword
    ></el-input>
    <el-input v-model="userValidation" placeholder="请输入验证码"></el-input>
    <el-button type="primary">确定</el-button>
    <el-button type="primary" @click="getValidation">获取验证码</el-button>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
@Component
export default class Register extends Vue {
  userName = "";
  userEmail = "";
  userCode1 = "";
  userCode2 = "";
  userValidation = "";

  getValidation() {
    console.log("等待验证码");
    axios({
      url: "localhost:3000/users/email",
      method: "get",
      params: {
        user_name: this.userName,
        email: this.userEmail,
      },
    }).then((code) => {
      alert(code);
    });
  }
}
</script>

<style>
</style>