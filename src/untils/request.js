// 封装axios请求函数
import axios from 'axios'
// create创建一个带配置项的自定义axios函数
// myAxios请求的时候，地址baseURL+url拼接  请求后台
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})
// 导出axios
export default myAxios
