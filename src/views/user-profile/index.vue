<template>
  <div class="user-profile">
    <!-- 头部导航 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 选择用户头像 -->
    <input type="file" hidden ref="file" @change="onFileChange">
    <!-- 展示的个人信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" round fit="cover" :src="user.photo"/>
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      :value="user.gender ? '女':'男' "
      is-link
      @click="isUpdateGenderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    ></van-cell>

    <!-- 弹出层区域 -->
    <!-- 昵称弹出层 -->
    <van-popup
      position="bottom"
      style="height:100%;"
      v-model="isUpdateNameShow"
    >
      <update-name
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- 性别弹出层 -->
    <van-popup position="bottom" v-model="isUpdateGenderShow">
      <update-gender
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
      />
    </van-popup>
    <!-- 生日弹出层 -->
    <van-popup position="bottom" v-model="isUpdateBirthdayShow">
      <update-birthday
        v-if="isUpdateBirthdayShow"
        @close="isUpdateBirthdayShow = false"
        v-model="user.birthday"
      />
    </van-popup>
    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%;"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
// 获取用户个人资料的请求模块
import { getUserProfile } from '@/api/user'
// 昵称组件
import UpdateName from './components/update-name'
// 性别组件
import UpdateGender from './components/update-gender'
// 生日组件
import UpdateBirthday from './components/update-birthday'
// 头像组件
import UpdatePhoto from './components/update-photo'

export default {
  name: 'UserProfile',
  data () {
    return {
      user: {}, // 用户信息
      isUpdateNameShow: false, // 控制昵称弹出层的显示状态
      isUpdateGenderShow: false, // 控制性别弹出层的显示状态
      isUpdateBirthdayShow: false, // 控制生日弹出层的显示状态
      img: null, // 预览的图片
      isUpdatePhotoShow: false
    }
  },
  methods: {
    // 获取个人信息
    async loadUserProfile () {
      try {
        const { data: res } = await getUserProfile()
        this.user = res.data
      } catch (err) {
        this.$toast.fail('获取个人资料失败')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]

      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)

      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true

      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完毕，把它的 value 清空
      this.$refs.file.value = ''
    }
  },
  created () {
    this.loadUserProfile()
  },
  components: {
    UpdateName, // 修改昵称组件
    UpdateGender, // 修改性别组件
    UpdateBirthday, // 修改生日组件
    UpdatePhoto // 修改头像组件
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }

  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
