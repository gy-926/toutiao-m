<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{comment.aut_name }}</div>
      <van-button
        class="like-btn"
        :icon="comment.is_liking?'good-job':'good-job-o'"
        :class="{liked:comment.is_liking}"
        :loading="commentLoading"
        @click="onCommentLike"
      >{{ comment.like_count || '赞' }}</van-button>
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content}}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{ comment.pubdate | relativeTime}}</span>
        <van-button
          class="reply-btn"
          round
          @click="$emit('reply-click',comment)"
        >回复 {{ comment.reply_count }}</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
// 对 评论点赞 或 取消点赞 请求模块
import { deleteCommentLike, addCommentLike } from '@/api/comment'

export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      commentLoading: false
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 点赞按钮的click事件
    async onCommentLike () {
      this.commentLoading = true
      try {
        if (this.comment.is_liking) {
          // 当前点赞状态：已赞，目的：取消点赞
          await deleteCommentLike(this.comment.com_id.toString())
          this.comment.like_count--
        } else {
          // 当前点赞状态：没有点赞，目的点赞
          await addCommentLike(this.comment.com_id + '')
          this.comment.like_count++
        }
        this.comment.is_liking = !this.comment.is_liking
      } catch (err) {
        this.error.fail('操作失败，请重试')
      }
      this.commentLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    // width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked {
      color: #e5645f;
    }
  }
}
</style>
