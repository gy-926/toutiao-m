<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar"/>
    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <!-- 图标 -->
        <i slot="left-icon" class="iconfont iconshouji"></i>
      </van-field>

      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <!-- 图标 -->
        <i slot="left-icon" class="iconfont iconyanzhengma"></i>
        <!-- 短信验证区域 -->
        <template #button>
          <!-- time就是倒计时时间 -->
          <van-count-down
            :time="1000*5"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow=false"
          />
          <van-button
            v-else
            round
            size="small"
            type="default"
            class="send-sms-btn"
            @click="onSendSms"
            native-type="button"
          >发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          block
          type="info"
          native-type="submit"
          class="login-btn"
        >登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        //   手机号和验证码
        mobile: '13911111111',
        code: '246810'
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false // 是否展示倒计时
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onSubmit () {
      // 在组件中必须使用this.$Toast
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 背景禁止点击
        duration: 0 // 默认是2000，如果为0就一直转
      })
      // 提交表单请求登录
      try {
        const { data: res } = await login(this.user)
        console.log('成功', res)
        this.$toast.success('登录成功')
        console.log(res.data)
        this.$store.commit('setUser', res.data)
      } catch (err) {
        if (err.response.status === 400) {
          // console.log('手机号或者验证码错误')
          this.$toast.fail('登录失败')
        } else {
          this.$toast.fail('登录失败')
        }
      }
      // 根据请求响应结果 处理后续操作
    },
    async onSendSms () {
      console.log('onSendSms')
      // 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 验证通过显示倒计时
      this.isCountDownShow = true
      // 发送请求验证码
      try {
        await sendSms(this.user.mobile)
        console.log('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 160px;
    height: 46px;
    background-color: #ededed;
    line-height: 46px;
    font-size: 22px;
  }
  .login-btn-wrap {
    margin: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
