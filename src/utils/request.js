// 请求模块
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'
// JSON.parse()
// JSON.stringify()
// JSONBig 可以处理数据中超出 javascript安全证书范围的问题
// JSON.parse() 把json格式的字符串转为js对象
// JSON.stringify() 把js对象转为json格式的字符串
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径 接口
  // 自定义后端返回的原始数据
  // data: 后端返回的原始数据，说白了就是 JSON 格式的字符串
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
    // axios 默认会在内部这样来处理后端返回的数据
    // return JSON.parse(data)
  }]
})

// 请求拦截
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // config：本次请求的请求配置对象
  const {
    user
  } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  //   console.log(config)
  // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
  return config
}, function (error) {
  // 如果请求出错了（还没有发出去）会进入这里
  return Promise.reject(error)
})
// 响应拦截
export default request
