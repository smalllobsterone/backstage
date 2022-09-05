// 封装axios请求函数
import axios from 'axios'
import store from '@/store'
import router from '@/router'

// create创建一个带配置项的自定义axios函数
// myAxios请求的时候，地址baseURL+url拼接  请求后台
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

// 定义请求拦截器，api每次调用request优先走这里
myAxios.interceptors.request.use(function(config) {
  // 在发起时，统一携带请求头Authorization和token值
  // 判断，登录页面和注册页面，vuex里无token，而且登录接口和注册接口也不需要携带token(其他页面需要)
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  // 在请求前触发一次
  return config
}, function(error) {
  // 请求发起前的代码，报错则会进入
  // 返回一个拒绝状态的promise对象(axios留在原地的Promise对象状态就为失败结果为error变量值)
  return Promise.reject(error)
})

// 定义响应拦截器
myAxios.interceptors.response.use(function(response) {
  // 响应状态码为 2xx 时触发成功的回调，形参中的 response 是“成功的结果”
  return response
}, function(error) {
  // 响应状态码不是 2xx 时触发失败的回调，形参中的 error 是“失败的结果”
  if (error.response.status === 401) {
    // 无效的 token
    // 把 Vuex 中的 token 重置为空，并跳转到登录页面
    store.commit('updateToken', '')
    store.commit(' updateUserInfo', {})
    router.push('/login')
  }
  return Promise.reject(error)
})

// 导出axios
export default myAxios
