<template>
  <div class="home-wrapper">
    <el-button>aaa</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
export default class Home extends Vue {}
</script>
<style lang= "scss" scoped>
.home-wrapper {
  margin-top: 90px;
  overflow-y: hidden;
}
</style>
