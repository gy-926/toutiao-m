<template>
  <div class="update-gender">
    <van-picker
      show-toolbar
      title="性别"
      :columns="columns"
      :default-index="value"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onPickerChange"
    />
  </div>
</template>

<script>
// 修改用户资料的请求模块
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value // 当前选中的性别
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '修改中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await updateUserProfile({
          gender: this.localGender
        })
        console.log(data)
        // 成功提示
        this.$toast.success('更新成功')
        // 隐藏修改昵称的弹出层
        this.$emit('close')
        // 将修改后的昵称，同步到父组件
        this.$emit('input', this.localGender)
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    },
    onCancel () {
      this.$emit('close')
    },
    onPickerChange (picker, value, index) {
      this.localGender = index
    }
  },
  props: {
    // 默认显示的性别
    value: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
