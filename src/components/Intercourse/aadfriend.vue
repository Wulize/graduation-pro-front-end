<template>
  <div class="addfriend"></div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class AddFriend extends Vue {
  public friend: string = "";
  // 添加好友确认弹窗
  public open() {
    this.$confirm("是否添加好友?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        this.$message({
          type: "success",
          message: "添加成功!",
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消",
        });
      });
  }
}
</script>
<style lang="scss">
.addfriend {
}
</style>
