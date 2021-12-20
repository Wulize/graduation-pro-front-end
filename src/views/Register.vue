<template>
  <div class="login-wrapper">
    <!-- 注册页图片 -->
    <div class="image-wrapper">
      <img src="@/assets/images/register/register01.jpg" />
    </div>
    <!-- 注册页输入 -->
    <el-form ref="form" :model="form" :rules="rules" class="input-wrapper">
      <el-form-item prop="email">
        <el-input
          v-model="form.userEmail"
          placeholder="请输入您的邮箱"
          class="user-input"
        ></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          v-model="form.userName"
          placeholder="请输入您的用户名"
          class="user-input"
        ></el-input>
      </el-form-item>
      <el-form-item prop="usercode1">
        <el-input
          v-model="form.userCode1"
          placeholder="请输入您的密码"
          showPassword
          class="user-input"
        ></el-input>
      </el-form-item>
      <el-form-item prop="usercode2">
        <el-input
          v-model="form.userCode2"
          placeholder="请再次输入您的密码"
          showPassword
          class="user-input"
        >
        </el-input>
      </el-form-item>
      <el-form-item class="code-wrapper" prop="validation">
        <el-input
          v-model="form.userValidation"
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
      </el-form-item>
      <div class="confirm-wrapper">
        <el-button type="primary" class="confirm" :disabled="ifConfirmForbidden"
          >确定</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
@Component
export default class Register extends Vue {
  public userCode2: string = "";
  public form: any = {
    userName: "",
    userEmail: "",
    userCode1: "",
    userCode2: "",
    userValidation: "",
  };
  public validationMessage: string = "获取验证码"; // 获取验证码按钮的显示信息
  // 未点击前：获取验证码
  // 点击后：倒计时
  public countDown: number = 60; // 倒计时
  public ifConfirmForbidden: boolean = true; // 是否禁用确定按钮
  public ifValidationForbidden: boolean = false; // 是否禁用获取验证码按钮
  public rules: any = {
    email: [
      {
        required: true,
        message: "请输入邮箱",
        validator: this.validateEmail,
        trigger: "blur",
      },
    ],
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    usercode1: [{ required: true, message: "请输入密码", trigger: "blur" }],
    usercode2: [{ required: true, message: "请再次输入密码", trigger: "blur" }],
    validation: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  };
  // 邮箱格式验证
  public validateEmail(rule: string, value: string, callback: any) {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (!value) {
      return callback(new Error("邮箱不能为空"));
    }
    setTimeout(() => {
      if (mailReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱格式"));
      }
    }, 100);
  }
  public getValidation() {
    this.ifConfirmForbidden = false;
    this.ifValidationForbidden = true;
    this.validationMessage = this.countDown + "s";
    axios({
      method: "get",
      url: "http://localhost:3000/users/email",
      withCredentials: true,
      params: {
        user_name: this.form.userName,
        pass_word: this.form.userCode1,
        email: this.form.userEmail,
      },
    });
    this.getCountDown();
  }
  public getCountDown() {
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

<style lang="scss">
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
    height: 100%;
    text-align: center;
    .el-form-item {
      .el-form-item__error {
        left: 26%;
      }
    }
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