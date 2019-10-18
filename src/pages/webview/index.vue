<template>
  <!-- web-view 微信小程序内容 组件  提供可跳转 其它url 操作 -->
  <web-view :src="url"></web-view>
</template>
<script>
export default {
  data() {
    return {
      url: ""
    };
  },
  onLoad(option) {
    // console.log(option);
    // 获取传递过来的参数
    this.url = option.url;
  }
};
</script>