<template>
  <div class="login-wrapper">
    <div class="login-info">
      <el-form :model="loginInfo" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="loginInfo.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input type="password" v-model="loginInfo.passWord" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="login-btn">
        <el-button @click="confirm">确定</el-button>
        <el-button @click="toRegister">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Login extends Vue {
  public loginInfo: any = {
    userName: '',
    passWord: '',
  }
  public rules: any = {
    userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    passWord: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  }
  public toRegister() {
    this.$router.push('/register')
  }
  public confirm() {
    // if (this.loginInfo.userName === "") {
    //   this.$message({
    //     showClose: true,
    //     message: "请输入用户名！",
    //     type: "warning",
    //   });
    // } else if (this.loginInfo.passWord === "") {
    //   this.$message({
    //     showClose: true,
    //     message: "请输入登录密码！",
    //     type: "warning",
    //   });
    // } else {
    //   (this as any).$http
    //     .get("/users/login", {
    //       userName: this.loginInfo.userName,
    //       password: this.loginInfo.passWord,
    //     })
    //     .then((ifLogin: any) => {
    //       if (ifLogin.status === 1) {
    //         this.$message({
    //           showClose: true,
    //           message: "登录成功！快来定制你的旅游计划吧！",
    //           type: "success",
    //         });
    //         this.$store.state.userName = this.loginInfo.userName;
    //         const avatarUrl = this.loginInfo.avatarUrl || "";
    //         sessionStorage.setItem("userName", ifLogin.userName);
    //         sessionStorage.setItem("avatarUrl", avatarUrl);
    //         sessionStorage.setItem("userName", this.loginInfo.userName);
    //         this.$router.push("/home");
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           message: "登录失败！请检查用户名密码！",
    //           type: "error",
    //         });
    //       }
    //     });
    // }
    this.$router.push('/home')
  }
  public mounted() {
    this.$store.state.showNav = false
  }
  public created() {
    ;(this as any).$http.get('/users/login', {}).then((ifLogin: any) => {
      if (ifLogin.status === 1) {
        this.$message({
          showClose: true,
          message: '登录成功！快来定制你的旅游计划吧！',
          type: 'success',
        })
        this.$store.state.userName = ifLogin.userName
        const avatarUrl = ifLogin.avatarUrl || ''
        sessionStorage.setItem('userName', ifLogin.userName)
        sessionStorage.setItem('avatarUrl', avatarUrl)
        this.$router.push('/home')
      } else {
        this.$message({
          showClose: true,
          message: '请先登录！',
          type: 'error',
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/images/login/login01.jpg');
  background-size: cover;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-info {
    width: 30%;
    height: 60%;
    min-width: 250px;
    min-height: 250px;
    position: relative;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px lightgray;
    .login-btn {
      .el-button {
        width: 70px;
        height: 40px;
        background: lightblue;
        color: gray;
      }
      .el-button:hover {
        background: skyblue;
      }
    }
  }
}
</style>