<template>
  <div class="home-wrapper">
    <div class="home-content">
      <div class="summary-images">
        <el-carousel :interval="3000" height="500px">
          <el-carousel-item v-for="image in images" :key="image.index" class="carousel">
            <img :src="image.source" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="site-info">
        <div class="info-image"></div>
        <div class="info-words">
          <div class="words-title">站点信息</div>
          <div class="words-content">本网站是基于LBS的旅游计划系统，在这里，用户可以根据自己的
            需求制定相应的旅游计划，此外，用户还可以查看景点信息并加以批注、与旅行伙伴进行线上社交、
            记录旅行过程中的所见所感、以及跟随导游的步伐以获得不一样的旅游体验。
          </div>
        </div>
      </div>
      <div class="siter-info">
        <div class="siter-one">
          <div class="info-title">站长1信息</div>
          <div class="info-content">
            <div class="siter-name">吴立泽</div>
            <div class="siter-background">
              <span>年龄：23</span>
              <span>学校：厦门大学信息学院数字媒体技术</span>
              <span>职业：前端开发工程师</span>
              <span>技术栈：html、css、js、nodejs、vue、koa、mongodb</span>
              <span>邮箱：1721958061@qq.com</span>
            </div>
          </div>
        </div>
        <div class="info-image"></div>
        <div class="siter-two">
          <div class="info-title">站长2信息</div>
          <div class="info-content">
            <div class="siter-name">杨烜</div>
            <div class="siter-background">
              <span>年龄：23</span>
              <span>学校：厦门大学信息学院软件工程</span>
              <span>职业：前端开发工程师</span>
              <span>技术栈：html、css、js、nodejs、vue、express、mongodb</span>
              <span>邮箱：875903125@qq.com</span>
            </div>
          </div>
        </div>
      </div>
      <div class="site-copyright">
        ©2021 Lize Wu @ Xuan Yang Inc. All Rights Reserved.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {},
})
export default class Home extends Vue {
  public images: any[] = [
    {
      index: 1,
      source: require('@/assets/images/home/home02.jpg'),
    },
    {
      index: 2,
      source: require('@/assets/images/home/home03.jpg'),
    },
    {
      index: 3,
      source: require('@/assets/images/home/home04.jpg'),
    },
    {
      index: 4,
      source: require('@/assets/images/home/home05.jpg'),
    },
    {
      index: 5,
      source: require('@/assets/images/home/home06.jpg'),
    },
    {
      index: 6,
      source: require('@/assets/images/home/home07.jpg'),
    },
    {
      index: 7,
      source: require('@/assets/images/home/home08.jpg'),
    },
  ]
  mounted() {
    this.$store.state.showNav = true
  }
}
</script>
<style lang= "scss" scoped>
.home-wrapper {
  width: 100%;
  height: auto;
  background-image: url('../assets/images/home/home01.jpg');
  background-size: cover;
  border-top: 1px solid lightblue;
  padding-bottom: 50px;
  .home-content {
    width: 80%;
    height: auto;
    margin-top: 90px;
    margin-left: 10%;
    .summary-images {
      // 轮播图
      .carousel {
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .site-info {
      // 站点信息
      width: 100%;
      margin-top: 50px;
      background: rgba($color: white, $alpha: 0.5);
      display: flex;
      .info-image {
        width: 40%;
        height: 300px;
        background-image: url('~@/assets/images/home/home09.jpg'); // 要像这样引入图片
        background-size: cover;
      }
      .info-words {
        width: 30%;
        height: 300px;
        background-image: url('~@/assets/images/home/home10.jpg');
        background-size: cover;
        margin-left: 15%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .words-title {
          font-size: 22px;
          background: yellow;
          color: gray;
          font-weight: bold;
        }
        .words-content {
          width: 80%;
          margin-top: 20px;
        }
      }
    }
    .siter-info {
      // 站长信息
      width: 100%;
      margin-top: 50px;
      height: auto; // 父元素设置了auto,直接子元素都得设置auto
      display: flex;
      justify-content: space-between;
      background: rgba($color: white, $alpha: 0.5);
      .info-image {
        width: 30%;
        height: 300px;
        background-image: url('~@/assets/images/home/home11.jpg'); // 要像这样引入图片
        background-size: cover;
      }
      .siter-one {
        width: 30%;
        height: 300px;
        background-image: url('~@/assets/images/home/home10.jpg');
        background-size: cover;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        justify-content: center;
        .info-title {
          font-size: 22px;
          background: yellow;
          color: gray;
          font-weight: bold;
        }
        .info-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
          .siter-name {
            font-size: 18px;
            background: lightblue;
            color: gray;
            font-weight: bold;
          }
          .siter-background {
            width: 70%;
            margin-top: 20px;
            display: flex;
            flex-direction: column;
          }
        }
      }
      .siter-two {
        width: 30%;
        height: 300px;
        background-image: url('~@/assets/images/home/home10.jpg');
        background-size: cover;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        justify-content: center;
        .info-title {
          font-size: 22px;
          background: yellow;
          color: gray;
          font-weight: bold;
        }
        .info-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
          .siter-name {
            font-size: 18px;
            background: lightblue;
            color: gray;
            font-weight: bold;
          }
          .siter-background {
            width: 70%;
            margin-top: 20px;
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
    .site-copyright {
      width: 100%;
      background: rgba($color: white, $alpha: 0.5);
      margin-top: 50px;
      text-align: center;
      color: rgba($color: black, $alpha: 0.5);
      font-weight: bold;
      font-size: 18px;
    }
  }
}
</style>
