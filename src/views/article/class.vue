<template>
  <!--  文章分类，与个人中心同一个二级挂载点-->
  <div>
    <el-card class='box-card'>
      <div slot='header' class='clearfix header-box'>
        <span>文章分类</span>
        <el-button type='primary' size='mini' @click='addArtBtn'>添加分类</el-button>
      </div>
      <!-- 表格区域 -->
      <el-table style='width: 100%' :data='cateList' border stripe>
        <!--type是index是第一个单元格用索引值 prop觉得单元格的内容-->
        <el-table-column label='序号' type='index' width='100'></el-table-column>
        <el-table-column label='分类名称' prop='cate_name'></el-table-column>
        <el-table-column label='分类别名' prop='cate_alias'></el-table-column>
        <el-table-column label='操作'>
          <!-- scope作用域插插槽 拿到组件中slot里面的变量数据绑到对象 {row：行对象} 就可以拿到id选择每一行-->
          <template v-slot='scope'>
            <el-button type='primary' size='mini' @click='updateclassFn(scope.row)'>修改</el-button>
            <el-button type='danger' size='mini' @click='removeclassFn(scope.row.id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类的对话框 -->
    <!-- visible.sync是组件内检测到对话框关闭-->
    <el-dialog :title="isEdit ? '编辑文章分类' : '添加文章分类'" :visible.sync='dialogVisible'
               width='35%' @closed='dialogCloseFn'>
      <!-- 添加的表单 是新增和修改共用的-->
      <el-form
        :model='addForm'
        :rules='addRules'
        ref='addRef'
        label-width='80px'
      >
        <el-form-item label='分类名称' prop='cate_name'>
          <el-input
            v-model='addForm.cate_name'
            minlength='1'
            maxlength='10'
          ></el-input>
        </el-form-item>
        <el-form-item label='分类别名' prop='cate_alias'>
          <el-input
            v-model='addForm.cate_alias'
            minlength='1'
            maxlength='15'
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button size='mini' type='primary' @click='confirmFn'>确 定</el-button>
        <el-button size='mini' @click='cancelFn'>取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArtClassAPI, addArtClassAPI, updateArtCateAPI, delArtCateAPI } from '@/api'

export default {
  name: 'art_class',
  data () {
    return {
      cateList: [], // 文章分类数组
      dialogVisible: false, // 添加分类-对话框是否显示
      addForm: { // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: { // 添加表单的验证规则对象
        cate_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur'
          }
        ],
        cate_alias: [
          {
            required: true,
            message: '请输入分类别名',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
          }
        ]
      },
      // 定义两个变量区分状态
      editId: '', // 正在编辑的文章分类id设置 无
      isEdit: false // FALSE是新增状态，true是编辑状态
    }
  },
  created () { // 获取文章分类列表
    this.getArtCateFn()
  },
  methods: {
    async getArtCateFn () {
      const res = await getArtClassAPI()
      this.cateList = res.data.data
    },
    // 添加分类点击事件
    addArtBtn () {
      this.isEdit = false // 添加分类 改为新增状态
      this.editId = '' // 置空
      this.dialogVisible = true // 让对话框出现
    },
    // 确定添加按钮-让对话框消失，调用保存文章分类接口
    confirmFn () { // 校验
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          // 通过校验 经过判断isedit的值来确定是要新增分类api还是修改分类
          if (this.isEdit) {
            // 要修改
            const { data: res } = await updateArtCateAPI({ id: this.editId, ...this.addForm })
            // 添加id在表单 或({id: this.editid, ...this.addForm}) 右边解构后与前边形成三个属性的对象然后传入
            // this.addForm.id = this.editId
            if (res.code !== 0) return this.$message.error('更新分类失败！')
            this.$message.success('更新分类成功！')
          } else { // 要新增
            const { data: res } = await addArtClassAPI(this.addForm)
            if (res.code !== 0) return this.$message.error(res.message)
            // ===0则提示成功
            this.$message.success(res.message)
          }
          // 异步加载，需要再重新请求一次文章列表，刷新数据
          this.getArtCateFn()
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    // 取消按钮
    cancelFn () {
      this.dialogVisible = false
    },
    // 对话框关闭的回调 点击空白，esc x 置空对话框
    dialogCloseFn () {
      this.$refs.addRef.resetFields() // 置空
    },
    // 更新分类/修改 前面的scope传过来一个行对象 {id cate_name cate_alias}
    updateclassFn (obj) {
      this.isEdit = true // 编辑状态
      this.editId = obj.id
      console.log(obj)
      // 数据回显 传入obj后 把obj对应的属性赋值给form，显示出来
      this.dialogVisible = true
      // 让el-dialog第一次挂载el-form时，先用addForm空字符串初始值绑定到内部，
      // 后续用作resetFields重置所以让真实DOM先创建并在内部绑定好复制好初始值
      this.$nextTick(() => {
        // 先让对话框出现, 它绑定空值的对象, 才能resetFields清空用初始空值
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    async removeclassFn (id) {
      const { data: res } = await delArtCateAPI(id)
      console.log(res)
      if (res.code !== 0) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      // 重新请求列表数据
      this.getArtCateFn()
    }
  }
}
</script>

<style lang='less' scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
