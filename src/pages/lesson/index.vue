<template>
  <div class="lesson">
    <swiper
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
      :circular="circular"
      indicator-active-color="rgba(255,255,255,0.6)"
    >
      <block v-for="(item,index) in imgUrls" :key="index">
        <swiper-item>
          <img :src="item" class="slide-image" />
        </swiper-item>
      </block>
    </swiper>

    <div class="classify">
      <!-- 导航  scroll-x 
         :scroll-into-view="toChildView"   值应为某子元素id  ， 可以设置滚动到某一个子元素的位置 
         scroll-with-animation   滚动条位置时使用动画过渡   
      -->
      <scroll-view class="btns_wrap" scroll-x :scroll-into-view="toChildView" scroll-with-animation>
        <span
          :class="{active: currentIndex == index}"
          class="btn_scroll"
          v-for="(item,index) in allLessons"
          :key="index"
          @click="switchItem(index)"
          :id="item.id"
        >{{item.name}}</span>
      </scroll-view>

      <!-- 内容  （内容可以随 切换导航滚动 并可以滑动 ） 
           :current="currentIndex" 动态绑定 当前所在滑块的 index  实现对应的联动
      
      -->
      <swiper :style="{height: swiperHeight+'rpx'}" :current="currentIndex" @change="swiperChange">
        <block v-for="(obj,i) in allLessons" :key="i">
          <swiper-item>
            <!-- 用一个 div容器 继续遍历 内面的内容  -->
            <div v-for="(item,index) in obj.lessons" :key="index">
              <!-- 使用之前封装好的组件  lessonCell -->
              <lessonCell
                :img="item.img"
                :title="item.title"
                :level="item.level"
                :count="item.count"
                :url="item.url"
              />
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
  </div>
</template>
<script>
import lessonCell from "../../components/lessonCell/index";
export default {
  data() {
    return {
      imgUrls: [],
      allLessons: [],

      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      circular: true,

      currentIndex: 0,
      toChildView: "", // 存储子元素id (点击跳转位置使用)
      swiperHeight: 240 // 初始化一个item （lessonCell）的高度  （查看里面有多少item, 用 swiperHeight*个数 = 总高度 ）
    };
  },
  onLoad() {
    this.getData();
  },
  components: {
    lessonCell
  },
  methods: {
    getData() {
      this.$https
        .request({
          url: this.$interfaces.getLessons,
          method: "get"
        })
        .then(res => {
          // console.log(res);
          this.imgUrls = res.imgUrls;
          this.allLessons = res.allLessons;

          // 在获取到数据之后也要再执行一下 此方法
          this.updateView();
        });
    },
    switchItem(index) {
      this.currentIndex = index;
      // 点击跳转位置方法  点击哪个一个就，就让哪一个在最前面。
      this.updateView();
    },
    updateView() {
      console.log(this.allLessons); // 获取所有的span 数据

      // 获取当前点击的那一个的id 赋值 给  toChildView
      this.toChildView = this.allLessons[this.currentIndex].id;

      //【 动态计算 当前点击项 下面列表 swiper 的高度】
      // 1. 计算 当前tab点击项 有多少个课程数量
      const length = this.allLessons[this.currentIndex].lessons.length;
      // 2. 更改swiperHeight的高度
      this.swiperHeight = length * 240;
      // 3. 在获取到数据之后也要再执行一下 此方法
    },
    swiperChange(e) {
      // console.log(e);
      this.currentIndex = e.mp.detail.current;
      this.updateView();
    }
  }
};
</script>
<style>
::-webkit-scrollbar {
  display: none;
}

.slide-image {
  width: 100%;
  height: 100%;
}

.btns_wrap {
  background-color: #fff;
  white-space: nowrap;
  border-bottom: 1px solid #ebeef5;
}
.btn_scroll {
  display: inline-block;
  padding: 0 16px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  box-sizing: border-box;
  text-align: center;
}

.active {
  color: #009eef;
}
</style>
