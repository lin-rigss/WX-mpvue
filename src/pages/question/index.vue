<template>
  <div class="question">
    <img class="bg" src="/static/imgs/test.jpg" alt />

    <div class="qs_content" v-if="questions.length > 0">
      <!--startqs 为 true  显示 提示  -->
      <div v-if="!startqs">
        <p class="title">温馨提示:</p>
        <div class="warn_tag">为了更好的为您制定学习计划,请首先回答以下问题, 我们会为您量身推荐相关的课程.</div>
      </div>

      <!-- 显示问题 -->
      <div v-else>
        <!-- 问题 -->
        <p class="title">{{questions[currentIndex].title}}</p>

        <!-- 选项 -->
        <div
          class="response"
          v-for="(item,index) in questions[currentIndex].option"
          :key="index"
          @click="selectAnswer(index)"
        >
          <img v-if="item.select" src="/static/imgs/selected.jpg" alt />
          <img v-else src="/static/imgs/unselect.jpg" alt />
          <span>{{item.label}}</span>
        </div>
      </div>
    </div>

    <button :disabled="disabled" @click="btn_click" class="qs_btn">{{btn_title}}</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      questions: [],
      startqs: false, // 是否显示问题
      currentIndex: 0, // 记录当前回答到第几道题
      btn_title: "开始答题", // 按钮的title
      lesson: "" // 记录提交选中的问题
    };
  },
  computed: {
    // 遍历所有选中有的select属性是否有true,如果有true,就返回 false  不禁用
    // 如果遍历所有 select 属性都是 false  就返回 true  禁用
    disabled() {
      if (!this.startqs) return false;
      else {
        const option = this.questions[this.currentIndex].option;
        let select = false;

        option.forEach(item => {
          if (item.select) select = true;
        });

        return !select;
      }
    }
  },
  // wx 的生命周期
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      this.$https
        .request({
          url: this.$interfaces.getQuestions,
          method: "get"
        })
        .then(res => {
          console.log(res); // 获取到的 全部问题数据
          this.questions = res.questions;
        });
    },

    btn_click() {
      // 如果没有开始测试(this.startqs为false) 按钮标题默认显示’开始答题’如果已经开始测试 判断是否为最后一题（this.currentIndex == this.questions.length - 1）如果不是最后一题，按钮标题为’下一题’ 否则显示’完成’

      if (!this.startqs) {
        this.startqs = true;
        this.btn_title = "下一题";
      } else {
        // 是,vue,node
        this.lesson += this.getSelectOption();
        //  0 < 2  (3-1)
        if (this.currentIndex < this.questions.length - 1) {
          this.btn_title = "下一题";
          this.currentIndex++;
          // 拼接逗号
          this.lesson += ",";
          if (this.currentIndex == this.questions.length - 1) {
            this.btn_title = "完成";
          }
        } else {
          // 完成
          console.log(this.lesson);
          this.sendQuestions();
        }
      }
    },

    // 点击选中执行的方法
    selectAnswer(index) {
      // 1. 首先要获取所有的选项
      const option = this.questions[this.currentIndex].option;

      // 2. 然后遍历所有的选项，让选项中的选中select 都置为false    未选中状态
      option.forEach(item => {
        item.select = false;
      });
      // 3. 将点击的选项选中   点击 true  再点击 false
      option[index].select = !option[index].select;
    },

    getSelectOption() {
      const option = this.questions[this.currentIndex].option;
      let label = "";
      option.forEach(item => {
        if (item.select) label = item.label;
      });
      return label;
    },

    sendQuestions() {
      // 定义默认等级为初级
      wx.setStorage({
        key: "grade",
        data: "初级"
      });
      this.$https
        .request({
          url: this.$interfaces.myLesson,
          method: "post",
          data: {
            // lesson拼接的问题答案
            lesson: this.lesson,
            // openid
            userId: this.$store.getters.openId
          }
        })
        .then(res => {
          console.log(res);
          // 存储课程信息
          this.$store.dispatch("setLessonInfo", res);

          // 跳转到学习页面
          wx.switchTab({
            url: "../learn/main"
          });
        });
    }
  }
};
</script>
<style>
.question {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.question .bg {
  width: 100%;
  height: 100%;
}
.qs_content {
  position: absolute;
  width: 80%;
  height: 50%;
  background: #fff;
  top: 36%;
  left: 10%;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 10px;
  color: rgb(13, 28, 51);
}
.qs_btn {
  position: absolute;
  top: 90%;
  left: 10%;
  width: 80%;
  background-color: #009eef;
  color: white;
}
.title {
  font-weight: bold;
  margin-bottom: 20px;
  word-break: break-all;
}
.warn_tag {
  padding: 40px 10px;
}
.response {
  padding: 10px;
}
.response img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>