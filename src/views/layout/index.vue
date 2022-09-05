<template>
  <el-container class='main-container'>
    <!--头部-->
    <el-header>
      <!--头部左侧logo-->
      <img src='../../assets/images/logo.png' alt='' />
      <!--头部右侧菜单-->
      <el-menu class='el-menu-top' mode='horizontal' background-color='#23262E'
               text-color='#fff' active-text-color='#409EF'>
        <!--个人中心-->
        <el-submenu index='1'>
          <template slot='title'>
            <!--头像-->
            <!-- 如果用户有自己的头像则用，没有则默认-->
            <img :src='user_pic' alt='' v-if='user_pic' class='avatar' />
            <img src='../../assets/images/logo.png' alt='' v-else class='avatar' />
            <span>个人中心</span>
          </template>
          <!--利用侧边栏绑定后完成的功能，可以直接跳转路由-->
          <router-link to='user-info'>
            <el-menu-item index='1-1'><i class='el-icon-s-operation' />基本资料</el-menu-item>
          </router-link>
          <router-link to='user-avatar'>
            <el-menu-item index='1-2'><i class='el-icon-camera'></i>更换头像</el-menu-item>
          </router-link>
          <router-link to='user-pwd'>
            <el-menu-item index='1-3'><i class='el-icon-key'></i>重置密码</el-menu-item>
          </router-link>
        </el-submenu>
        <!--退出-->
        <el-menu-item index='2' @click='quitFn'><i class='el-icon-switch-button'></i>退出</el-menu-item>
      </el-menu>
    </el-header>

    <el-container>
      <!--侧边栏-->
      <el-aside width='200px'>
        <div class='user-box'>
          <!-- 如果用户有自己的头像则用，没有则默认-->
          <img :src='user_pic' alt='' v-if='user_pic' />
          <img src='../../assets/images/logo.png' alt='' v-else />
          <span>您好 {{ nickname || username }}</span>
        </div>
        <!--导航栏-->
        <!-- 默认不能固定-->
        <el-menu :default-active='$route.path'
                 class='el-menu-vertical-demo'
                 background-color='#23262E'
                 text-color='#fff'
                 active-text-color='#409EFF'
                 unique-opened
                 router>
          <template v-for='item in menus'>
            <el-menu-item :index='item.indexPath' :key='item.indexPath' v-if='!item.children'>
              <i :class='item.icon'></i>{{ item.title }}
            </el-menu-item>
            <!-- 嵌套子菜单的“一级菜单” -->
            <el-submenu :index='item.indexPath' :key='item.indexPath' v-else>
              <template slot='title'><!--不需要key-->
                <i :class='item.icon'></i>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item v-for='obj, index in item.children' :index='obj.indexPath'
                            :key='index'>
                <i :class='obj.icon'></i>
                <span>{{ obj.title }}</span>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 页面主体区域 -->
        <!-- 二级路由挂载点 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>momomomoomommomomomomoomomomomo</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<!--template只能用vue体系自带的变量，如data和计算属性等-->
<script>
// 在组件标签上绑定的所有事件(包括原生事件的名字click， input等等) quitFn是自定义
// 都是自定义事件，都需要组件内$emit来触发才行
import { mapGetters } from 'vuex'
import { getMenusListAPI } from '@/api'

export default {
  name: 'index',
  data () {
    return {
      menus: [] // 保存侧边栏的请求数据
    }
  },
  // 映射
  computed: {
    ...mapGetters(['nickname', 'username', 'user_pic'])
  },
  methods: {
    // 二次确认退出
    quitFn () {
      this.$confirm('真的要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定退出 清除vuex的token缓存和用户信息 todo commit
        this.$store.commit('updateToken', '')
        this.$store.commit('updateUserInfo', {})
        // 强制跳转
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    // 获取侧边栏菜单数据
    async getMenusListFn () {
      const { data: res } = await getMenusListAPI()
      console.log(res)
      this.menus = res.data
    }
  },
  created () {
    // 请求侧边栏数据
    this.getMenusListFn()
  }
}
</script>

<style lang='less' scoped>
.main-container {
  height: 100%;

  .el-header,
  .el-aside {
    background-color: #23262e;
  }

  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }

  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }

  span {
    color: white;
    font-size: 12px;
  }
}

// 侧边栏菜单的样式
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
