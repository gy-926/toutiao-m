<template>
  <div class="comment-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      :immediate-check="false"
      error-text="加载失败，请点击重试"
    >
      <comment-item
        v-for="(item,index) in list"
        :key="index"
        :comment="item"
        @reply-click="$emit('reply-click',$event)"
      />
    </van-list>
  </div>
</template>

<script>
// 获取评论的请求模块
import { getComments } from '@/api/comment'
// 评论项组件
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  data () {
    return {
      // list: [],
      loading: false, // 当次加载状态
      finished: false,
      offset: null, // 最后一条评论的id
      limit: 10,
      error: false
    }
  },
  methods: {
    async onLoad () {
      try {
        const { data: res } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 文章id或评论id
          offset: this.offset,
          limit: this.limit // 请求的评论数量
        })
        const { results } = res.data
        // console.log(res.data);

        this.list.push(...results)
        // 将获取的数据传递给父组件
        this.$emit('onload-success', res.data)
        // 加载状态结束
        this.loading = false
        if (results.length) {
          this.offset = res.data.last_id
        } else {
          // 数据全部加载完成
          this.finished = true
        }
      } catch (err) {
        this.error = true
        // 加载状态结束
        this.loading = false
        console.log(err)
      }
    }
  },
  props: {
    // 文章id或评论id
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 评论容器
    list: {
      type: Array,
      default: () => []
    },
    // 评论的类型 a:文章评论 c：评论的回复
    type: {
      type: String,
      validator (val) {
        return ['a', 'c'].includes(val)
      },
      default: 'a'
    }
  },
  created () {
    this.loading = true
    this.onLoad()
  },
  components: {
    // 评论项组件
    CommentItem
  }
}
</script>

<style lang="less" scoped>
</style>
