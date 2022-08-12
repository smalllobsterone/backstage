// 接口统一管理，封装的是具体的接口请求方法
// 每个方法只负责请求一个url
// 导入axios
import request from '@/untils/request'

// 并导出这个接口方法
export const registerAPI = () => {
  // promise对象，内部包含ajax请求
  // return这个promise对象到逻辑页面，去那边对promise对象提取结果
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username: 'dada',
      password: '1123456',
      repassword: '12356'
    }
  })
}
