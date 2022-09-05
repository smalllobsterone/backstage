import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'), // 默认打开布局页
    redirect: '/home', // 重定向,匹配/时进到home
    // 嵌套路由 侧边栏
    children: [
      {
        path: 'home', // 首页
        component: () => import('@/views/home')
      },
      {
        path: 'user-info', // 基本资料
        component: () => import('@/views/users/userInfo')
      },
      {
        path: 'user-avatar', // 更换头像
        component: () => import('@/views/users/userAvatar')
      },
      {
        path: 'user-pwd', // 更换密码
        component: () => import('@/views/users/userPwd')
      },
      {
        path: 'art-cate', // 文章分类
        component: () => import('@/views/article/class')
      },
      {
        path: 'art-list', // 文章分类
        component: () => import('@/views/article/artlist')
      }
    ]
  },
  {
    path: '/reg',
    // webpack提供的import函数来路由懒加载导入
    // 路由懒加载，就是页面路由路径切换到/reg，才去加载对应组件代码
    // 好处:让首页加载文件体积更新，打开更快
    component: () => import('@/views/register')
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }

]

const router = new VueRouter({
  routes
})
// 白名单: 不需要携带token的api地址
const whiteAPIList = ['/reg', '/login']

// 退出登录，重新登录，只走相关组件代码（异步dom切换，不会导致所有代码重新执行
// 换个账号需要重新请求用户数据
// 采用全局前置路由守卫，浏览器第一次打开页面就会触发
router.beforeEach((to, from, next) => {
  const token = store.state.token
  // 有token即登录，没有则没登录
  if (token) {
    if (!store.state.userInfo.username) {
      // 本地有token值，才去请求。
      // 确保本地有值时不会重复请求。即登陆后不会重复执行请求
      store.dispatch('getUserInfoActions') // 路由切换则放行
    }
    next()
  } else {
    if (whiteAPIList.includes(to.path)) {
      // 未登录，可以访问的路由地址放行,不会执行全局守卫
      next()
    } else {
      // 未登录，还想去首页，则强制切换到登录页，这是一个权限管理，非登录不可见。
      next('/login')
    }
  }
})
export default router
