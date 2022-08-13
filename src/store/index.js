import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '' // 保存token字符串
  },
  getters: {},
  mutations: {
    // 保存token
    updateToken (state, val) {
      state.token = val
    }
  },
  actions: {},
  modules: {},
  // 调用插件
  plugins: [createPersistedstate()]
})
