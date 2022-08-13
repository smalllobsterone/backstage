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
            <img src='../../assets/images/logo.png' alt='' class='avatar'>
            <span>个人中心</span>
          </template>
          <el-menu-item index='1-1'><i class='el-icon-s-operation'></i>基本资料</el-menu-item>
          <el-menu-item index='1-2'><i class='el-icon-camera'></i>更换头像</el-menu-item>
          <el-menu-item index='1-3'><i class='el-icon-key'></i>重置密码</el-menu-item>
        </el-submenu>
        <!--退出-->
        <el-menu-item index='2' @click='quitFn'><i class='el-icon-switch-button'></i>退出</el-menu-item>
      </el-menu>
    </el-header>

    <el-container>
      <!--侧边栏-->
      <el-aside width='200px'>Aside</el-aside>
      <!--页面-->
      <el-container>
        <!-- 主体-->
        <el-main>main后台主页</el-main>
        <!--底部foot-->
        <el-footer>momomomommommomomofoot</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// 经验:在组件标签上绑定的所有事件(包括原生事件的名字click， input等等) quitFn是自定义
// 都是自定义事件，都需要组件内$emit来触发才行
export default {
  name: 'index',
  methods: {
    quitFn () {
      // 二次确认退出
      this.$confirm('真的要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定退出 清除vuex的token缓存 todo commit
        this.$store.commit('updateToken', '')
        // 强制跳转
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
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
