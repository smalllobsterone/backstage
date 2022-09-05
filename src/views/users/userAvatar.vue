<template>
  <el-card class='box-card'>
    <div slot='header' class='clearfix'>
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img class='the_img' v-if='!this.avatar' src='../../assets/images/avatar.jpg' alt='' />
      <img class='the_img' v-else :src='this.avatar' alt=''>

      <!-- 按钮区域 -->
      <div class='btn-box'>
        <input type='file' accept='image/*' style='display: none' ref='iptRef' @change='onFileChange' />
        <el-button type='primary' icon='el-icon-plus' @click='chooseImg'>选择图片</el-button>
        <el-button type='success' icon='el-icon-upload' :disabled="avatar === ''" @click='uploadFn'>上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateAvatarAPI } from '@/api'

export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    // 选择图片->点击事件->让选择框出现
    chooseImg () {
      // 模拟点击行为 $ref获取input
      this.$refs.iptRef.click()
    },
    // todo 选择图片 触发的改变事件 input是原生的标签，样式不好改，用js代码获取dom $ref
    onFileChange (e) {
      // todo 获取用户选择的文件列表（伪数组）
      const files = e.target.files
      if (files.length === 0) {
        // 打开了窗口但不选择 仍禁用上传
      } else {
        // 选择了图片
        // todo 方法2 1. 创建 FileReader 对象
        const fr = new FileReader()
        // 2. 调用 内置readAsDataURL 函数，读取文件内容 传入文件对象 （固定句式）
        fr.readAsDataURL(files[0])
        // 3. onload，等文件读成base64触发
        fr.onload = (e) => {
          // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
          this.avatar = e.target.result
        }
        // todo 方法1.使用URL.createObjURL()来转换文件变成图片临时地址(纯前端本地)实现预览
        // this.avatar = URL.createObjectURL(files[0])
      }
    },
    // 上传头像
    async uploadFn () {
      const { data: res } = await updateAvatarAPI(this.avatar)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 重新让vuex获取下最新的用户数据
      this.$store.dispatch('getUserInfoActions')
    }
  }
}
</script>

<style lang='less' scoped>
.btn-box {
  margin-top: 10px;
}

.preview {
  object-fit: cover;
}

.the_img {
  width: 350px;
  height: 350px;
}
</style>
