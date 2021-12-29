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
export default class Home extends Vue {
  mounted() {
    this.$store.state.showNav = true;
  }
}
</script>
<style lang= "scss" scoped>
.home-wrapper {
  /* background: gray; */
}
</style>
