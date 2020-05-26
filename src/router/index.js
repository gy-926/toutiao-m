import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
Vue.use(VueRouter)
// 路由表
const routes = [{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login')
},
{
  path: '/',
  component: () => import('@/views/layout'),
  children: [{
    path: '',
    name: 'home',
    component: () => import('@/views/home')
  },
  {
    path: '/qa',
    name: 'qa',
    component: () => import('@/views/qa')
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('@/views/video')
  },
  {
    path: '/my',
    name: 'my',
    component: () => import('@/views/my')
  }]
},
{
  path: '/search',
  name: 'search',
  component: () => import('@/views/search')
},
{
  path: '/article/:articleId',
  name: 'article',
  component: () => import('@/views/article'),
  props: true // 开启 Props 传参，说白了就是把路由参数映射到组件的 props 数据中
},
{
  path: '/user/profile',
  name: 'user-profile',
  component: () => import('@/views/user-profile')
}
]
const router = new VueRouter({
  routes
})
export default router
