<template>
  <div class="personalInfo">
    <el-drawer
      title="个人信息"
      :visible.sync="isShow"
      :before-close="handleClose"
      class="draw-wrap"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="昵称 :">
          <el-input v-model="form.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="注册邮箱 :">
          <el-input v-model="form.email" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账号密码 :">
          <el-input
            v-model="form.password"
            :disabled="false"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="注册时间 :">
          <el-input v-model="form.date" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="上传新头像 :">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :data="uploadData"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="drawer__footer">
        <el-button @click="handleClose" class="cancleButton">取 消</el-button>
        <el-button
          type="primary"
          @click="submit"
          :loading="loading"
          class="confirmButton"
          >{{ loading ? "提交中 ..." : "确 定" }}</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class PersonalInfo extends Vue {
  @Prop() public isShow: boolean = false;
  public imageUrl: string = "";
  public loading: boolean = false;
  //  头像上传地址
  public uploadUrl: string = "http://up-z2.qiniup.com";
  //   上传token
  public uploadData: any = { key: "", token: "" };
  public qiniuUrl: string = "http://ratpspren.hn-bkt.clouddn.com/";
  public form: any = {
    name: "",
    email: "",
    password: "",
  };
  public handleClose() {
    this.$emit("close");
  }
  public created() {
    (this as any).$http.get("/chat/getMyInfo", {}).then((response: any) => {
      this.form.name = (response.info || {}).userName;
      this.form.email = (response.info || {}).email;
      this.form.password = (response.info || {}).password;
      this.form.date = (response.info || {}).date;
    });
  }
  //   mounted中获取七牛云数据库token
  public mounted() {
    (this as any).$http.get("/chat/getQiniuToken", {}).then((res: any) => {
      if (res.code === "0") {
        this.uploadData.token = res.data.uploadToken;
      }
    });
  }
  //   头像提交成功事件
  public handleAvatarSuccess(res: any, file: any) {
    this.qiniuUrl += res.key || "";
    this.imageUrl = URL.createObjectURL(file.raw);
  }
  //   提交前进行判断
  public beforeAvatarUpload(file: any) {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJPG) {
      this.$message.error("上传头像图片只能是 JPG、PNG格式!");
    }
    if (!isLt2M) {
      this.$message.error("上传头像图片大小不能超过 2MB!");
    }
    this.uploadData.key = `upload_pic_${new Date().getTime()}_${file.name}`;
    return isJPG && isLt2M;
  }

  //   提交修改数据
  public submit() {
    (this as any).$http
      .get("/users/renewInfo", {
        userName: this.form.name,
        password: this.form.password,
        avatarUrl:
          this.qiniuUrl !== "http://ratpspren.hn-bkt.clouddn.com/"
            ? this.qiniuUrl
            : sessionStorage.getItem("avatarUrl"),
        email: this.form.email,
        date: this.form.date,
      })
      .then((response: any) => {
        this.$message({
          showClose: true,
          message: `${response.msg}`,
          type: "success",
        });
        if (this.qiniuUrl !== "http://ratpspren.hn-bkt.clouddn.com/")
          sessionStorage.setItem("avatarUrl", this.qiniuUrl);
        this.$emit("close");
      });
  }
}
</script>
<style lang="scss">
.personalInfo {
  .draw-wrap {
    .el-form-item {
      width: 95% !important;
    }
    .avatar-uploader .el-upload {
      margin-left: 40px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 89px;
        height: 89px;
        line-height: 89px;
        text-align: center;
      }
      .avatar {
        width: 89px;
        height: 89px;
        display: block;
      }
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .drawer__footer {
      position: absolute;
      bottom: 20px;
      .cancleButton {
        margin-left: 50px;
        width: 150px;
      }
      .confirmButton {
        margin-left: 50px;
        width: 150px;
      }
    }
  }
}
</style>