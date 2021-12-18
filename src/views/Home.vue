<template>
  <div class="home">
    <Login msg="Welcome to Your Vue.js + TypeScript App" />
    <el-button>aaa</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "@/components/login.vue"; // @ is an alias to /src
@Component({
  components: {
    Login,
  },
})
export default class Home extends Vue {}
</script>
