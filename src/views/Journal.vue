<template>
  <div class="journal-wrapper">
    <div class="content-wrapper">
      <div class="user-wrapper">
        <div class="avatar"></div>
        <div class="info">
          <div class="name">吴小泽</div>
          <div class="description">欢迎来到你的创作空间</div>
        </div>
        <div class="rw-choose">
          <el-button type="plain" icon="el-icon-reading" :class="[ifShowRead?'choosed-btn':'choose-btn']" autofocus @click="toRead"></el-button>
          <el-button type="plain" icon="el-icon-edit" :class="[ifShowRead?'choose-btn':'choosed-btn']" @click="toWrite"></el-button>
        </div>
      </div>
      <div class="rw-wrapper">
        <div v-if="ifShowRead">
          <Read></Read>
        </div>
        <div v-else>
          <Write></Write>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Read from '../components/journal/Read.vue'
import Write from '../components/journal/Write.vue'
@Component({
  components: {
    Read,
    Write,
  },
})
export default class extends Vue {
  public ifShowRead: boolean = true

  public toRead(): void {
    this.ifShowRead = true
  }

  public toWrite(): void {
    this.ifShowRead = false
  }

  public handleScroll(): void {
    console.log('您正在滚动!')
  }
}
</script>

<style lang="scss">
.journal-wrapper {
  width: 100%;
  height: auto;
  background-image: url('~@/assets/images/journal/journal01.jpg');
  background-size: 100%;
  border-top: 1px solid lightgray;
  .content-wrapper {
    width: 80%;
    height: 80%;
    // background: white;
    margin-left: 10%;
    margin-top: 100px;
    .user-wrapper {
      width: 35%;
      height: 80px;
      background: white;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      border-radius: 10px;
      box-shadow: 0 0 10px white;
      .avatar {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-image: url('~@/assets/images/journal/journal01.jpg');
        background-size: cover;
      }
      .info {
        height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        // align-items: center;
        color: gray;
        .name {
          font-size: 18px;
        }
        .description {
          font-size: 15px;
          color: lightgray;
        }
      }
      .rw-choose {
        display: flex;
        flex-direction: column;
        .choose-btn {
          width: 25px;
          height: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          font-size: 16px;
          color: gray;
          &:hover {
            background: lightgreen;
            color: white;
          }
        }
        .choosed-btn {
          width: 25px;
          height: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          font-size: 16px;
          color: gray;
          background: lightgreen;
          color: white;
          border: 1px solid lightgreen;
        }
      }
    }
    .rw-wrapper {
      width: 100%;
      // height: 80%;
      margin-top: 30px;
      // background: white;
      // overflow: auto;
    }
  }
}
</style>