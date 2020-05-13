import Vue from 'vue'
import Vuex from 'vuex'
import {
  getItem,
  setItem
} from '@/utils/storage'
Vue.use(Vuex)
// 用户登录成功后的token
const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 用户登录成功后的token
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 数据持久化
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
