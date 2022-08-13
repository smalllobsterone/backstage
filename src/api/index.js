// 接口统一管理，封装的是具体的接口请求方法
// 每个方法只负责请求一个url
// 导入axios
import request from '@/untils/request'
// registerAPI(this.regForm)接受那三个传参//todo
// 形参obj的值是对象{}
// obj= { username: ' ', password:‘值', repassword: ''}
// 左侧想要对象解构赋值(语法↓)
// { username: username变量名，password:变量名，repassword:变量名}={password:'值', repassword: ''}
// 函数形参的obj就改成对象解构接收传入的数据对象
// { username: username，password: password,repassword: repassword }
// key是传入的对象key匹配,value是变量名（同名），用于接收外面传入的值
// ES6规定，key和value变量同名的时候，可以简写(key既为key也是value变量名)

// 并导出这个接口方法
export const registerAPI = ({
  username,
  password,
  repassword
}) => {
  // promise对象，内部包含ajax请求
  // return这个promise对象到逻辑页面，去那边对promise对象提取结果
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}
/**
 * 登录接口
 * @param username
 * @param password
 * @returns {*} promise对象
 */
export const loginAPI = ({
  username,
  password
}) => {
  // promise对象，内部包含ajax请求
  // return这个promise对象到逻辑页面，去那边对promise对象提取结果
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}
