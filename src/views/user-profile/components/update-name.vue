<template>
  <div class="update-name">
    <!-- 头部导航 -->
    <van-nav-bar
      title="昵称设置"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
// 修改用户资料的请求模块
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateName',
  data () {
    return {
      // 将传递的昵称，初始化为文本框的值
      localName: this.value
    }
  },
  methods: {
    // 修改昵称
    async onConfirm () {
      if (!this.localName) {
        this.$toast('昵称不能为空')
        return
      }
      this.$toast.loading({
        message: '修改中...',
        forbidClick: true,
        duration: 0
      })
      try {
        await updateUserProfile({
          name: this.localName
        })
        // 成功提示
        this.$toast.success('更新成功')
        // 隐藏修改昵称的弹出层
        this.$emit('close')
        // 将修改后的昵称，同步到父组件
        this.$emit('input', this.localName)
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  },
  props: {
    // 昵称
    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.field-wrap {
  padding: 20px;
}
</style>
