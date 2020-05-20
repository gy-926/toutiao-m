<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search',text)"
    >
      <div slot="title" v-html="heightlight(text)"></div>
    </van-cell>
  </div>
</template>
<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载有好处：只会把用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    //   搜索内容
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  computed: {},
  watch: {
    searchText: {
      //   handler (val) {
      //     this.loadSearchSuggestions(val)
      //   },
      //   debounce 参数一，一个函数，参数二，延迟时间，返回值，防抖之后的函数
      handler: debounce(function (val) {
        // console.log(value)
        this.loadSearchSuggestions(val)
      }, 300),
      immediate: true // 立即监听
    }
  },
  created () { },
  mounted () { },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('数据获取失败 ')
      }
    },
    // 设置搜索建议出现内容高亮提示
    heightlight (text) {
      // 根据搜索框的内容进行匹配
      const highlightStr = `<span class="active">${this.searchText}</span>`

      // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
      //   根据内容替换结果 g是全局匹配 i是忽略大小写
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>
<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
