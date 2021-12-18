<template>
  <div class="login">
    <div class="name">{{ msg }}</div>
    <div class="password"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class Login extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    margin: 10px;
  }
}
.name {
  width: 20%;
  height: 2rem;
}
.password {
  width: 20%;
  height: 2rem;
}
</style>
