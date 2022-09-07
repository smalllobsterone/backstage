// 接口统一管理，封装的是具体的接口请求方法
// 每个方法只负责请求一个url
import request from '@/untils/request'
// 直接引入store对象，不采用this.$store

// registerAPI(this.regForm)接受那三个传参//todo
// 形参obj的值是对象{}
// obj= { username: ' ', password:‘值', repassword: ''}
// 左侧想要对象解构赋值(语法↓)
// { username: username变量名，password:变量名，repassword:变量名}={password:'值', repassword: ''}
// 函数形参的obj就改成对象解构接收传入的数据对象
// { username: username，password: password,repassword: repassword }
// key是传入的对象key匹配,value是变量名（同名），用于接收外面传入的值
// ES6规定，key和value变量同名的时候，可以简写(key既为key也是value变量名)

/**
 *注册接口
 * @param username
 * @param password
 * @param repassword
 * @returns {*}
 */
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
/**
 * 获取用户信息
 * @returns {*}
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
    // 默认get请求 不写method
  })
}
/**
 * 获取侧边栏数据
 * @returns {*}
 */
export const getMenusListAPI = () => {
  return request({
    url: '/my/menus'
  })
}

/**
 * 更新-用户基本资料
 * @param {*} param0 { id: 用户id, email: 用户邮箱, nickname: 用户昵称, user_pic: 用户头像地址, username: 用户名 }
 * @returns Promise对象
 */
// 解构赋值
// eslint-disable-next-line camelcase
export const updateUserInfoAPI = ({ id, email, nickname, user_pic, username }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      email,
      nickname,
      user_pic,
      username
    }
  })
}

/**
 * 更新用户头像
 * @returns {*}
 */
export const updateAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar // 头像base64字符串
    }
  })
}
/**
 * 重置密码
 * @returns {*}
 */

// eslint-disable-next-line camelcase
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}
/**
 * 获取-文章分类
 * @returns Promise对象
 */
export const getArtClassAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 增加-文章分类
 * @param {*} param0 { cate_name: 文章分类名字, cate_alias: 文章分类别名 }
 * @returns Promise对象
 */
// eslint-disable-next-line camelcase
export const addArtClassAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 * 更新-文章分类
 * @param {*} param0 { id: 文章分类id, cate_name: 文章分类名字, cate_alias: 文章分类别名 }
 * @returns Promise对象
 */
// eslint-disable-next-line camelcase
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

/**
 * 删除-文章分类
 * @param {*} id 要删除的-文章分类id
 * @returns Promise对象
 */
export const delArtCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

/**
 * 发布文章
 * @param {*} fd 表单对象
 * @returns Promise对象
 */
export const uploadArticleAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd
    // 注意不再是json格式了 参数要的是表单对象, 不能写普通对象, axios内部会判断, 如果是表单对象,
    // 传递的请求体会设置Content-Type: form-data与后端对应
  })
}

/**
 * 获取文章列表 查询字符串
 * @returns Promise对象
 */
// eslint-disable-next-line camelcase
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

/**
 * 获取-文章详情
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const getArticleDetailAPI = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

/**
 * 删除-文章
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const delArticleAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
