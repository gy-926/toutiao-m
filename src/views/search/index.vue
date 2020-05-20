<template>
  <div class="search-container">
    <!-- 搜索组件 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#5babfb"
        @focus="isResultShow=false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText"/>
    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- 历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
    />
  </div>
</template>
<script>
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import SearchSuggestion from './components/search-suggestion'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  props: {
  },
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的显示
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索的历史记录数据
    }
  },
  computed: {},
  watch: {
    searchHistories (value) {
      //   console.log(123)
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  created () { },
  mounted () { },
  methods: {
    onSearch (val) {
      //   console.log(val)
      this.searchText = val
      //  删除重复搜索
      const index = this.searchHistories.indexOf(val)
      if (index > 0) {
        this.searchHistories.splice(index, 1)
      }
      // 记录用户的搜索信息
      this.searchHistories.unshift(val)
      this.isResultShow = true
    },
    onCancel () {
      // 返回到点击之前的页面
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.search-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
