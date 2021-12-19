<template>
  <div class="login-wrapper">
    <button @click="toRegister">注册</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Login extends Vue {
  toRegister() {
    this.$router.push('/register')
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  width: 100px;
  height: 100px;
}
</style>