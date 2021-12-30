<template>
  <div class="login-wrapper">
    <!-- 注册页图片 -->
    <div class="image-wrapper">
      <img src="@/assets/images/register/register01.jpg" />
    </div>
    <!-- 注册页输入 -->
    <el-form ref="form" :model="form" :rules="rules" class="input-wrapper">
      <el-form-item prop="userEmail">
        <el-input
          v-model="form.userEmail"
          placeholder="请输入您的邮箱"
          class="user-input"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userName">
        <el-input
          v-model="form.userName"
          placeholder="请输入您的用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userCode1">
        <el-input
          v-model="form.userCode1"
          placeholder="请输入您的密码"
          showPassword
        ></el-input>
      </el-form-item>
      <el-form-item prop="userCode2">
        <el-input
          v-model="form.userCode2"
          placeholder="请再次输入您的密码"
          showPassword
        >
        </el-input>
      </el-form-item>
      <el-form-item id="code-wrapper" prop="userValidation">
        <el-input
          v-model="form.userValidation"
          placeholder="请输入验证码"
        ></el-input>
        <el-button
          type="primary"
          class="validation-code"
          @click="getValidation"
          :disabled="ifValidationForbidden"
          >{{ validationMessage }}</el-button
        >
      </el-form-item>
      <div>
        <el-button
          type="primary"
          :disabled="ifConfirmForbidden"
          @click="commit"
        >
          确定
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import router from "@/router";
@Component
export default class Register extends Vue {
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
    userEmail: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
    userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    userCode1: [{ required: true, message: "请输入密码", trigger: "blur" }],
    userCode2: [{ required: true, message: "请再次输入密码", trigger: "blur" }],
    userValidation: [
      { required: true, message: "请输入验证码", trigger: "blur" },
    ],
  };
  // 邮箱格式验证
  public validateEmail(value: string) {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (mailReg.test(value)) {
      return true;
    } else {
      this.$message({
        showClose: true,
        message: "邮件格式出错",
        type: "warning",
      });
      return false;
    }
  }
  // 校验密码
  public validatePassword() {
    if (this.form.userCode1 === "" || this.form.userCode2 === "") {
      this.$message({
        showClose: true,
        message: "密码不能为空！",
        type: "warning",
      });
      return false;
    } else if (this.form.userCode1 !== this.form.userCode2) {
      this.$message({
        showClose: true,
        message: "前后密码不一致",
        type: "warning",
      });
      return false;
    } else return true;
  }
  // 点击获取验证码之前用户名不能为空
  public validateUsername() {
    if (this.form.userName === "") {
      this.$message({
        showClose: true,
        message: "用户名不能为空！",
        type: "warning",
      });
      return false;
    } else return true;
  }
  // 点击获取验证码之前进行校验操作
  public getValidation() {
    if (
      !(
        this.validateEmail(this.form.userEmail) &&
        this.validatePassword() &&
        this.validateUsername()
      )
    )
      return;
    const params = {
      userName: this.form.userName,
      password: this.form.userCode1,
      email: this.form.userEmail,
    };
    (this as any).$http.get("/users/email", params).then((result: any) => {
      const { message, success } = result;
      if (success === false) {
        this.$message({
          showClose: true,
          message,
          type: "warning",
        });
        this.validationMessage = "获取验证码";
        this.ifValidationForbidden = false;
      } else {
        this.ifConfirmForbidden = false;
        this.ifValidationForbidden = true;
        this.validationMessage = this.countDown + "s";
        this.$message({
          showClose: true,
          message,
          type: "success",
        });
        this.getCountDown();
      }
    });
  }
  // 获取验证码后进行倒计时操作
  public getCountDown() {
    if (this.countDown === 0) {
      this.validationMessage = "获取验证码";
      this.ifConfirmForbidden = true;
      this.ifValidationForbidden = false;
      this.countDown = 60;
      return;
    } else {
      setTimeout(() => {
        this.countDown--;
        this.validationMessage = this.countDown + "s";
        this.getCountDown();
      }, 1000);
    }
  }
  // 获得验证码之后提交验证码
  public commit() {
    const params: any = {
      userName: this.form.userName,
      password: this.form.userCode1,
      email: this.form.userEmail,
      code: this.form.userValidation,
    };
    (this as any).$http.get("/users/register", params).then((result: any) => {
      const { status } = result;
      if (status === 1) {
        this.$message({
          showClose: true,
          message: "注册成功！快来定制你的旅游计划吧！",
          type: "success",
        });
        this.$router.push("/login");
      } else {
        this.$message({
          showClose: true,
          message: "注册失败，请确认验证码！",
          type: "warning",
        });
      }
    });
  }
  mounted() {
    this.$store.state.showNav = false;
  }
}
</script>

<style lang="scss">
.login-wrapper {
  width: 100vw;
  height: 100vh;
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
    margin: 10% 0 0 17%;
    width: 25%;
    #code-wrapper {
      width: 100%;
      .el-form-item__content {
        display: flex !important;
        margin-top: 3.2%;
        width: 100%;
      }
      .el-button {
        width: 35%;
      }
      .el-input {
        width: 65%;
      }
    }
  }
}
</style>