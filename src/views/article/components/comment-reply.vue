<template>
  <div class="comment-reply">
    <!-- 标题 -->
    <van-nav-bar
      :title="comment.reply_count? `有${comment.reply_count}条回复`:'暂无回复'"
    >
      <van-icon slot="left" name="cross" @click="$emit('close')"></van-icon>
    </van-nav-bar>
    <div class="scroll-wrap">
      <!-- 被点击的评论项 -->
      <comment-item :comment="comment"/>
      <!--  -->
      <van-cell title="全部回复"/>
      <!-- 评论的 评论列表 -->
      <comment-list :source="comment.com_id" type="c" :list="commentList"/>
    </div>

    <!-- 底部区域 -->
    <div class="reply-bottom">
      <van-button
        class="write-btn"
        size="small"
        round
        @click="isPostShow = true"
      >写评论</van-button>
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post :target="comment.com_id" @post-success="onPostSuccess"/>
    </van-popup>
    <!-- /发布评论 -->
  </div>
</template>
<script>
// 评论项组件
import CommentItem from './comment-item'
// 评论的列表组件
import CommentList from './comment-list'
// 评论回复组件
import CommentPost from './comment-post'
export default {
  name: 'CommentReply',
  data () {
    return {
      isPostShow: false,
      commentList: [] // 评论的回复列表
    }
  },
  methods: {
    onPostSuccess (data) {
      // 更新回复的数量
      this.comment.reply_count++

      // 关闭弹层
      this.isPostShow = false

      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  components: {
    // 评论项组件
    CommentItem,
    // 评论的列表组件
    CommentList,
    // 评论回复组件
    CommentPost
  }
}
</script>

<style lang="less" scoped>
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

.reply-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .write-btn {
    width: 60%;
  }
}
</style>
