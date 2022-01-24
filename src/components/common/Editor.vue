<template>
  <div class="editor-wrapper">
    <div ref="editor" id="editor"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import E from 'wangeditor'
@Component({})
export default class extends Vue {
  public editor: any = null
  mounted() {
    this.editor = new E('#editor')
    this.editor.config.menus = [    // 设置文本框的菜单栏有哪些项
      'fontSize',
      'fontName',
      'bold',
      'foreColor',
      'backColor',
      'emoticon',
      'image',
    ]
    this.editor.config.showLinkImg = false  // 去掉“网络上传图片”
    this.editor.config.uploadImgShowBase64 = true  // 设置图片base64上传
    this.editor.config.uploadImgAccept = ['jpg', 'png', 'jpeg'] // 支持的图片格式
    this.editor.config.height = 500   // 编辑器的高度
    this.editor.config.zIndex = 100   // 编辑器的z-index
    this.editor.create()
  }
}
</script>

<style lang="scss">
</style>