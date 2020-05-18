<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit =!isEdit"
      >{{isEdit ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        v-for="(channel,index) in myChannels"
        :key="index"
        class="grid-item"
        @click="onMychannelClick(channel,index)"
      >
        <van-icon
          name="clear"
          slot="icon"
          v-show="isEdit && !fiexChannels.includes(channel.id)"
        ></van-icon>
        <span
          class="text"
          :class="{ active: index === active }"
          slot="text"
        >{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        class="grid-item"
        @click="onAddChannel(channel)"
      ></van-grid-item>
    </van-grid>
  </div>
</template>
<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'channelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算属性会观测内部依赖数据的变化
    // 数据发生变化，计算属性会重新执行
    recommendChannels () {
      // 第一种写法
      // const channels = []
      // this.allChannels.forEach(channel => {
      // // find也是遍历数组
      // const ret = this.myChannels.find(myChannels => {
      // return myChannels.id === channel.id
      // })
      // // 如果我的频道不包含 该频道项 channel 则收集到推荐频道中
      // if (!ret) {
      // channels.push(channel)
      // }
      // })
      // //  把计算机结果返回
      // return channels
      // }
      // 第二种写法数组的filter方法，遍历把符合要求的元素存储到新数组中并返回
      return this.allChannels.filter(channel => {
        // 数组的find的方法 把符合条件的第一个元素返回
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () { },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        // console.log(data)
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      // console.log(channel)
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, // 频道ID
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录存储在本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMychannelClick (channel, index) {
      if (this.isEdit) {
        //   如果是固定频道则不删除
        if (this.fiexChannels.includes(channel.id)) {
          return
        }
        // 删除频道项
        this.myChannels.splice(index, 1)
        // 如果是编辑状态执行删除操作
        // 参数1，要删除的元素的索引
        // 参数2，删除的个数，如果不指定，则从参数1开始删除到最后
        if (index <= this.active) {
          // 让1激活的频道减1,选中的频道项不会改变
          this.$emit('update-active', this.active - 1, true)
        }
        // 处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，则将数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}

</script>
<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
