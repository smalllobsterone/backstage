<!--这是注册页面-->
<template>
  <!--注册页面的整体盒子-->
  <div class='reg-container'>
    <!--注册页面-->
    <div class='reg-box'>
      <!--标题-->
      <div class='title-box'></div>
      <!--表单区域 自带校验rules+prop同属性名-->
      <!--需要在模板中添加对表单组件的引用：ref 的作用主要用来获取表单组件手动触发验证-->
      <el-form :model='regForm' :rules='rulesObj' ref='regRef'>
        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input v-model='regForm.username'
                    placeholder='请输入用户名'></el-input>
        </el-form-item>

        <!-- 密码且不暴露-->
        <el-form-item prop='password'>
          <el-input v-model='regForm.password' type='password'
                    placeholder='请输入密码'></el-input>
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item prop='repassword'>
          <el-input v-model='regForm.repassword' type='password'
                    placeholder='请再次确认密码'></el-input>
        </el-form-item>
        <!--表单按钮及以下部分-->
        <el-form-item>
          <!-- 注册按钮-->
          <el-button type='primary' rules='' class='btn-reg' @click='registerFn'>注册</el-button>
          <!--去登录链接-->
          <el-link type='info' @click="$router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 前端绑定诗句对象属性名，可以直接给要调用的功能接口的参数名一致
// 可以直接吧前端对象（带着同名属性和前端的值）发送给后台
import { registerAPI } from '@/api'

export default {
  data () {
    // 需要通过this访问组件内部变量regform，拿到密码值，做判断
    // 注意:必须在data函数里定义此箭头函数，才能确保this.form使用 todo
    const samePwdFn = (rule, value, callback) => {
      if (value !== this.regForm.password) {
        // 如果验证失败，则调用 回调函数时，指定一个 Error 对象。
        callback(new Error('两次输入的密码不一致!'))
      } else {
        // 如果验证成功，则直接调用 callback 回调函数即可。
        callback()
      }
    }
    return {
      // 注册表单的数据对象regForm
      regForm: {
        username: '', // 用户名
        password: '', // 密码
        repassword: ''// 确认密码
      },
      // 表单规则校验对象
      rulesObj: {
        username: [ // 用户名
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            // Pattern用法(正则表达式)，正则匹配$
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10的大小写字母数字',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请设置您的密码',
            trigger: 'blur'
          },
          { // \S匹配非空字符
            pattern: /^\S{6,15}$/,
            message: '密码必须为6-15个非空字符',
            trigger: 'blur'
          }],
        repassword: [ // 确认密码，不能正则，需要判断
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          },
          { // 加上这段会再次报空格错，不加则直接判断是否相同
            pattern: /^\S{6,15}$/,
            message: '密码必须为6-15个非空字符',
            trigger: 'blur'
          },
          {
            validator: samePwdFn,
            trigger: 'blur'
          }]
      }
    }
  },
  methods: {
    // todo 注册的点击事件
    registerFn () {
      // 此段功能: 当用户未填写完数据或失焦，直接点击注册按钮，自动出提示
      // js兜底校验 validate方法是表单组件自带的，用来对表单内容进行检验。
      // 需要在模板中添加对表单组件的引用：ref
      this.$refs.regRef.validate(async valid => {
        if (valid) {
          // 通过校验
          // 1. 调用注册接口  把axios返回的数据对象里data字段对应的值保存在对象
          const { data: res } = await registerAPI(this.regForm)
          console.log(res)
          // 2. 注册失败，提示用户  弹窗提示$message  不为0进异步 return阻止代码往下执行
          if (res.code !== 0) return this.$message.error(res.message)
          // 3. 注册成功，提示用户
          this.$message.success(res.message)
          // 4. 跳转到登录页面
          this.$router.push('/login')
        } else {
          return false // 阻止默认的提交行为（表单下面的红色提示自动出现）
        }
      })
    }
  }
}
</script>.

<style lang='less' scoped>
.reg-container {
  //要给挂载的view父级div设置高度，或者不要父级。否则背景无法渲染
  background: url("../../assets/images/login_bg.jpg") center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url("../../assets/images/login_title.png") center no-repeat;
    }

    .btn-reg {
      width: 100%;
    }
  }
}
</style>
