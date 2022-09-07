import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '', // 保存token字符串
    userInfo: {}// 保存用户信息对象（id，名称，昵称，email，pic）
  },
  getters: {
    // 形参只有一个，省略小括号
    nickname: state => state.userInfo.nickname,
    username: state => state.userInfo.username,
    user_pic: state => state.userInfo.user_pic
  },
  mutations: {
    // 保存token
    updateToken (state, val) {
      state.token = val
    },
    // 保存用户信息 接到的是val，赋值给state
    updateUserInfo (state, info) {
      state.userInfo = info
    }
  },
  actions: {
    // 发请求-用户信息,promise对象拿结果,直接提交commit保存在state
    async getUserInfoActions (store) {
      const res = await getUserInfoAPI()// 自动拿token，不需要传参
      console.log(res)
      store.commit('updateUserInfo', res.data.data)
    }
  },
  modules: {},
  // 调用持久化插件
  plugins: [createPersistedState()]
})
