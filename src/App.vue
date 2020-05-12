<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view/>
    <h3>黑马头条</h3>
    <van-button type="danger">危险按钮</van-button>
    <div>
      <i class="iconfont iconshipin"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style lang="less">
</style>
