<template>
  <div class="plan-wrapper">
    <div class="require-wrapper">
      <div class="time-chooser"></div>
      <div class=""></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {}
</script>

<style lang="scss" scoped>
.plan-wrapper {
  width: 100%;
  height: calc(100vh - 1px);
  border-top: 1px solid lightgreen;
  background-image: url('~@/assets/images/plan/plan02.jpg');
  background-size: cover;
  .require-wrapper {
    width: 80%;
    height: 80%;
    margin-top: 100px;
    margin-left: 10%;
    background: rgba($color: white, $alpha: 0.5);
  }
}
</style>