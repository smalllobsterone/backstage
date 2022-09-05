<template>
  <el-card class='box-card'>
    <div slot='header' class='clearfix'>
      <span>修改密码</span>
    </div>
    <!-- 表单 -->
    <el-form
      :model='pwdForm'
      :rules='pwdFormRules'
      ref='pwdFormRef'
      label-width='100px'>
      <el-form-item label='原密码' prop='old_pwd'>
        <!-- todo 给v-model赋值就可以显示初始值-->
        <el-input v-model='pwdForm.old_pwd' type='password'></el-input>
      </el-form-item>
      <el-form-item label='新密码' prop='new_pwd'>
        <!-- todo 给v-model赋值就可以显示初始值-->
        <el-input v-model='pwdForm.new_pwd' type='password'></el-input>
      </el-form-item>
      <el-form-item label='确认密码' prop='re_pwd' type='password'>
        <el-input v-model='pwdForm.re_pwd'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='updateFn'>修改密码</el-button>
        <el-button @click='resetFn'>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updatePwdAPI } from '@/api'

export default {
  name: 'userPwd',
  data () {
    // 判断新旧是否一致
    const samePwdFn = (rules, value, callback) => {
      if (this.pwdForm.old_pwd === value) {
        callback(new Error('新旧密码不能相同！'))
      } else { // 通过校验
        callback()
      }
    }
    // 与第一次设置的新密码  判断两次新是否一致
    const rePwd = (rules, value, callback) => {
      if (value !== this.pwdForm.new_pwd) {
        callback(new Error('两次输入的密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      pwdForm: {
        old_pwd: '', // 原密码
        new_pwd: '', // 新密码
        re_pwd: ''// 确认新密码
      },
      // 表单规则校验对象
      pwdFormRules: {
        old_pwd: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'blur'
          },
          {
            // Pattern用法(正则表达式)，正则匹配$
            pattern: /^\S{6,15}$/,
            message: '密码必须为6-15个非空字符',
            trigger: 'blur'
          }
        ],
        new_pwd: [
          {
            required: true,
            message: '请设置您的新密码',
            trigger: 'blur'
          },
          { // \S匹配非空字符
            pattern: /^\S{6,15}$/,
            message: '密码必须为6-15个非空字符',
            trigger: 'blur'
          },
          {
            validator: samePwdFn,
            trigger: 'blur'
          }],
        re_pwd: [
          {
            required: true,
            message: '请再次输入新密码',
            trigger: 'blur'
          },
          { // 加上这段会再次报空格错，不加则直接判断是否相同
            pattern: /^\S{6,15}$/,
            message: '密码必须为6-15个非空字符',
            trigger: 'blur'
          },
          {
            validator: rePwd,
            trigger: 'blur'
          }]
      }
    }
  },
  methods: {
    // 修改密码->点击确认
    updateFn () {
      this.$refs.pwdFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await updatePwdAPI(this.pwdForm)
          if (res.code !== 0) return this.$message.error('原密码错误！')
          this.$message.success('更新密码成功！')
          this.$refs.pwdFormRef.resetFields()
          // 重置退出 清除vuex的token缓存和用户信息 todo commit
          this.$store.commit('updateToken', '')
          this.$store.commit('updateUserInfo', {})
          // 强制跳转
          this.$router.push('/login')
        } else {
          return false
        }
      })
    },
    // 重置按钮->点击事件
    resetFn () {
      this.$refs.pwdFormRef.resetFields()
    }
  }
}
</script>

<style lang='less' scoped>
.el-form {
  width: 500px;
}
</style>
