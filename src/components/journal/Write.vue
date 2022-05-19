<template>
  <div class="write-wrapper">
    <div class="journal-pic">
      <div class="pic-wrapper" v-if="imageUrl">
        <div class="head-pic"><img :src="imageUrl" /></div>
        <div class="change-btn">
          <el-button type="plain" @click="choosePic">更换图片</el-button>
        </div>
      </div>
      <div class="pic-upload" @click="choosePic" v-else>
        <div class="upload-btn">
          <div class="left-top"></div>
          <div class="right-top"></div>
          <div class="right-bottom"></div>
          <div class="left-bottom"></div>
        </div>
        <div class="upload-title">
          <div class="main-words">请上传游记头图</div>
          <div class="detail-words">图片格式应为jpg/png，且大小不超过2MB</div>
        </div>
      </div>
      <el-upload class="pic-uploader" action="*" ref="upload" :show-file-list="false" :auto-upload="false" :on-change="beforeUpload">
      </el-upload>
    </div>
    <div class="journal">
      <div class="journal-content">
        <Editor ref="editor" />
      </div>
      <div class="journal-details">
        <div class="journal-title">
          <el-input v-model="title" placeholder="请输入游记标题" maxlength="25"></el-input>
          <div class="tip">长度应在25个字符以内</div>
        </div>
        <div class="journal-tab">
          <el-input v-model="tab" placeholder="请输入景点名称" maxlength="10"></el-input>
          <div class="tip">长度应在10个字符以内</div>
        </div>
        <div class="journal-submit">
          <el-button type="plain" @click="submitJournal">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Editor from '@/components/common/Editor.vue'
import { press } from '@/utils/index'
@Component({
  components: {
    Editor,
  },
})
export default class extends Vue {
  public userName: string = '吴小泽' // 用户名
  public avatar: string = '' // 用户头像
  public title: string = '' // 游记标题
  public tab: string = '' // 游记标签（景点）
  public imageUrl: string = '' // 头图URL

  public choosePic(): void {
    // 触发el-upload事件
    ;(this as any).$refs.upload.$children[0].$refs.input.click()
  }

  public beforeUpload(file: any) {
    // 选择图片后获取图片字符串
    const isCorrectType =
      file.raw.type === ('image/jpeg' || file.raw.type === 'image/png')
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isCorrectType) {
      this.$message.error('上传头像图片只能是 JPG/PNG格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传头像图片大小不能超过 2MB!')
    }
    if (isCorrectType && isLt2M) {
      new Promise((resolve, reject) => {
        // 将图片转为base64
        const reader = new FileReader()
        let base64: string | ArrayBuffer | null = ''
        reader.readAsDataURL(file.raw)
        reader.onload = () => {
          base64 = reader.result
        }
        reader.onerror = (error) => {
          reject(error)
        }
        reader.onloadend = () => {
          resolve(base64)
        }
      }).then((res: any) => {
        // press(res, 1) // 压缩图片
        //   .then((result: any) => {
        //     this.imageUrl = result
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   })
        this.imageUrl = res
      })
    }
  }

  public submitJournal(): void {
    if (this.imageUrl.length === 0) {
      this.$message({
        showClose: true,
        message: '请先上传头图哦！',
        type: 'error',
      })
    } else {
      if (this.title.length === 0 && this.tab.length !== 0) {
        this.$message({
          showClose: true,
          message: '请输入游记标题！',
          type: 'error',
        })
      } else if (this.title.length !== 0 && this.tab.length === 0) {
        this.$message({
          showClose: true,
          message: '请输入景点名称！',
          type: 'error',
        })
      } else if (this.title.length === 0 && this.tab.length === 0) {
        this.$message({
          showClose: true,
          message: '请完善游记基本信息！',
          type: 'error',
          customClass: 'largeZindex',
        })
      } else {
        const editor = (this as any).$refs.editor.editor
        let html = editor.txt.html()
        if (html === '') {
          this.$message({
            showClose: true,
            message: '请输入游记内容！',
            type: 'error',
          })
        } else {
          // 上传游记
          const pattern: any = /src=["](.+?)["]/g
          const preSrc: any = html.match(pattern) // 正则获取游记中img标签的src
          if (preSrc === null) {
            ;(this as any).$http //  替换完后上传游记
              .post('/yx/uploadJournal', {
                userName: this.userName,
                headPic: this.imageUrl,
                title: this.title,
                tab: this.tab,
                content: html,
                viewAmount: 0,
              })
              .then((res: any) => {
                console.log(res)
                this.$message({
                  showClose: true,
                  message: '插入游记成功！快去查看你的大作吧！',
                  type: 'success',
                })
                editor.txt.clear()
                this.title = ''
                this.tab = ''
                this.imageUrl = ''
              })
          } else {
            for (let i = 0; i < preSrc.length; i++) {
              preSrc[i] = preSrc[i].replace('src=', '')
              preSrc[i] = preSrc[i].replaceAll('"', '')
            }
            const newSrc: any = []
            for (let i = 0; i < preSrc.length; i++) {
              // 压缩src并替换原html串
              press(preSrc[i], 3)
                .then((result: any) => {
                  newSrc.push(result)
                  html = html.replace(preSrc[i], newSrc[i])
                  if (i === preSrc.length - 1) {
                    ;(this as any).$http //  替换完后上传游记
                      .post('/yx/uploadJournal', {
                        userName: this.userName,
                        headPic: this.imageUrl,
                        title: this.title,
                        tab: this.tab,
                        content: html,
                        viewAmount: 0,
                      })
                      .then((res: any) => {
                        console.log(res)
                        this.$message({
                          showClose: true,
                          message: '插入游记成功！快去查看你的大作吧！',
                          type: 'success',
                        })
                        editor.txt.clear()
                        this.title = ''
                        this.tab = ''
                        this.imageUrl = ''
                      })
                  }
                })
                .catch((err) => {
                  console.log(err)
                })
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.write-wrapper {
  width: 100%;
  padding-bottom: 30px;
  .largeZindex {
    /* 修改$message的z-index */
    z-index: 999;
  }
  .journal-pic {
    /* 游记头图 */
    width: 100%;
    height: 350px;
    background: rgba($color: white, $alpha: 0.6);
    .pic-upload {
      /* 头图上传 */
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px white;
      .upload-btn {
        cursor: pointer;
        font-size: 100px;
        color: gray;
        background: white;
        width: 20%;
        height: 50%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: center;
        border: 1px dashed lightgray;
        div {
          width: 40%;
          height: 40%;
        }
        .left-top {
          border-right: 2px solid lightgray;
        }
        .right-bottom {
          border-top: 2px solid lightgray;
        }
        .left-bottom {
          border-top: 2px solid lightgray;
          border-left: 2px solid lightgray;
        }
      }
      .upload-title {
        margin-left: 5%;
        line-height: 40px;
        .main-words {
          font-size: 25px;
          color: gray;
        }
        .detail-words {
          font-size: 16px;
          color: gray;
        }
      }
    }
    .pic-wrapper {
      /* 头图展示 */
      width: 100%;
      height: 100%;
      position: relative;
      .head-pic {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .change-btn {
        position: absolute;
        left: calc(50% - 60px);
        top: calc(50% - 20px);
        .el-button {
          width: 120px;
          height: 40px;
          font-size: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: gray;
          &:hover {
            background: lightgreen;
            color: white;
          }
        }
      }
    }
  }
  .journal {
    margin-top: 30px;
    width: 100%;
    display: flex;
    background-image: linear-gradient(
      rgba(lightblue, 0.8) 0,
      rgba(lightblue, 0.8) 20%,
      rgba(white, 0.8) 0,
      rgba(white, 0.8) 40%,
      rgba(lightblue, 0.8) 0,
      rgba(lightblue, 0.8) 60%,
      rgba(white, 0.8) 0,
      rgba(white, 0.8) 80%,
      rgba(lightblue, 0.8) 0,
      rgba(lightblue, 0.8) 100%
    );
    background-size: 100%;
    box-shadow: 0 0 10px white;
    .journal-content {
      /* 游记正文 */
      width: 65%;
    }
    .journal-details {
      width: 35%;
      display: flex;
      flex-direction: column;
      text-align: center;
      // justify-content: space-evenly;

      // line-height: ;
      .journal-title {
        /* 游记标题 */
        width: 100%;
        margin-top: 35%;
        .el-input__inner {
          width: 80%;
          height: 45px;
          font-size: 16px;
          &:focus {
            border-color: lightgreen;
          }
        }
        .tip {
          font-size: 16px;
          color: gray;
          text-align: left;
          margin-left: 13%;
          position: relative;
        }
        .tip::before {
          content: '*';
          display: block;
          position: absolute;
          color: red;
          font-size: 24px;
          left: -3.5%;
        }
      }
      .journal-tab {
        /* 游记标签 */
        margin-top: 12%;
        .el-input__inner {
          width: 80%;
          height: 45px;
          font-size: 16px;
          &:focus {
            border-color: lightgreen;
          }
        }
        .tip {
          font-size: 16px;
          color: gray;
          text-align: left;
          margin-left: 13%;
          position: relative;
        }
        .tip::before {
          content: '*';
          display: block;
          position: absolute;
          color: red;
          font-size: 24px;
          left: -3.5%;
        }
      }
      .journal-submit {
        /* 游记提交  */
        margin-top: 12%;
        .el-button {
          width: 80%;
          height: 45px;
          color: gray;
          &:hover {
            background: lightgreen;
            color: white;
          }
        }
      }
    }
  }
}
</style>