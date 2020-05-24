<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
      title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div
            slot="label"
            class="publish-date"
          >{{article.pubdate | relativeTime}}</div>

          <!-- 关注组件 -->
          <!--
            <follow-user class="follow-btn" :user-id="article.aut_id"
            :is_followed="article.is_followed"
            @update-is_followed="article.is_followed = $event" />
          -->
          <!--
            v-model="article.is_followed" 等价于下面两行代码
            :is_followed="article.is_followed"
            @update-is_followed="article.is_followed = $event"
          -->
          <follow-user
            class="follow-btn"
            :user-id="article.aut_id"
            v-model="article.is_followed"
          />

          <!-- <van-button v-if="article.is_followed"  round size="small" @click="onFollow" :loading="followLoading">已关注
    </van-button>
    <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus"
      @click="onFollow" :loading="followLoading">关注
          </van-button>-->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          ref="article-content"
          class="article-content markdown-body"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 评论内容 -->
        <comment-list
          :list="commentList"
          :source="article.art_id"
          @onload-success="totalCommentCount = $event.total_count"
          @reply-click="onReplyClick"
        />

        <!-- 底部区域 -->
        <div class="article-bottom">
          <!-- 添加评论 -->
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostshow = true"
          >写评论</van-button>
          <!-- 评论数量 -->
          <van-icon name="comment-o" :info="totalCommentCount" color="#777"/>
          <!-- 文章收藏 -->
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          />
          <!-- 文章点赞 -->
          <like-article
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <!-- 文章分享 -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发表评论的弹出层 -->
        <!-- 弹出层是懒加载，只有第一次展示才会渲染数据 -->
        <van-popup v-model="isPostshow" position="bottom">
          <comment-post :target="article.art_id" @post-success="onPostSuccess"/>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 v-else-if=""-->
      <div v-else-if="errStatus" class="error-wrap">
        <van-icon name="failure"/>
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure"/>
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 回复评论弹出层 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%;">
      <!-- v-if true 渲染元素节点 false 不渲染 -->
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
// 文章 请求模块
import { getArticleById } from '@/api/article'
// 图片预览函数
import { ImagePreview } from 'vant'
// 关注组件
import FollowUser from '@/components/follow-user'
// 收藏组件
import CollectArticle from '@/components/collect-article'
// 点赞组件
import LikeArticle from '@/components/like-article'
// 评论组件
import CommentList from './components/comment-list.vue'
// 评论弹出层包裹的发表评论的组件
import CommentPost from './components/comment-post.vue'
// 评论回复 的组件
import CommentReply from './components/comment-reply.vue'

export default {
  name: 'ArticleIndex',
  // 给所有的后代组件提供数据
  // 注意：不要滥用
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  data () {
    return {
      article: {}, // 文章详情信息
      loading: true, // 加载数据的状态
      errStatus: 0, // 请求失败时的错误状态码
      totalCommentCount: 0, // 当前文章的评论数量
      isPostshow: false, // 发表评论弹出层的显示状态
      commentList: [], // 保存新创建的评论对象
      isReplyShow: false, // 控制回复评论弹出层的显示状态
      currentComment: {} // 当前被点击回复的评论对象
    }
  },
  methods: {
    // 获取文章详情
    async loadArticle () {
      this.loading = true // 跟新加载状态
      try {
        const { data: res } = await getArticleById(this.articleId)
        this.article = res.data
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        console.log(err)
      }
      this.loading = false
    },
    // 图片预览
    previewImage () {
      const articleContent = this.$refs['article-content'] // 获取文章内容的父元素
      const imgs = articleContent.querySelectorAll('img') // 获取文章内容中所有的img标签
      const images = [] // 保存预览图片的地址

      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = function () {
          // 预览图片
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
    },
    onPostSuccess (comment) {
      this.isPostshow = false // 隐藏发表评论弹出层
      this.commentList.unshift(comment.new_obj)
    },
    onReplyClick (comment) {
      // 当前被点击回复的评论对象
      this.currentComment = comment
      // console.log(comment);
      // 展示 回复评论的弹出层
      this.isReplyShow = true
    }
  },
  components: {
    FollowUser, // 关注组件
    CollectArticle, // 收藏组件
    LikeArticle, // 点赞组件
    CommentList, // 评论组件
    CommentPost, // 发表评论组件
    CommentReply // 评论回复 的组件
  },
  created () {
    this.loadArticle()
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>
