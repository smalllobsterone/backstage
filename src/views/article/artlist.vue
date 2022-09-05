<template>
  <div>
    <el-card class='box-card'>
      <!-- 头部-->
      <div slot='header' class='clearfix'>
        <span>文章列表</span>
      </div>
      <!-- 搜索区域-->
      <div class='search-box'>
        <el-form :inline='true' :model='q'>
          <el-form-item label='文章分类'>
            <el-select v-model='q.cate_id' placeholder='请选择分类' size='small'>
              <!-- 循环渲染分类的可选项 -->
              <el-option :label='item.cate_name' :value='item.id'
                         v-for='item in cateList' :key='item.id'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='发布状态' style='margin-left: 15px'>
            <el-select v-model='q.state' placeholder='请选择状态' size='small'>
              <el-option label='已发布' value='已发布'></el-option>
              <el-option label='草稿' value='草稿'></el-option>
            </el-select>
          </el-form-item>
          <el-button type='primary' style='margin-top: 4px' size='small' @click='initArtListFn'>筛选</el-button>
          <el-button type='info' style='margin-top: 4px' size='small' @click='resetListFn'>重置</el-button>
        </el-form>
        <!-- 发表文章-->
        <el-button type='primary' size='small'
                   class='btn-pub' @click='showPubDialogFn'>发表文章
        </el-button>
      </div>
      <!-- 文章表格区域 -->
      <!--      <el-table :data='artList' style='width: 100%' border stripe>-->
      <!--        <el-table-column label='文章标题'>-->
      <!--          <template v-slot='{ row }'>-->
      <!--            <el-link type='primary' @click='showDetailFn(row.id)'>-->
      <!--              {{ row.title }}-->
      <!--            </el-link>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--        <el-table-column label='分类' prop='cate_name'></el-table-column>-->
      <!--        <el-table-column label='发表时间' prop='pub_date'>-->
      <!--          <template v-slot='{ row }'>-->
      <!--            <span>{{ $formatDate(row.pub_date) }}</span>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--        <el-table-column label='状态' prop='state'></el-table-column>-->
      <!--        <el-table-column label='操作'>-->
      <!--          <template v-slot='{ row }'>-->
      <!--            <el-button type='danger' size='mini' @click='removeFn(row.id)'>删除</el-button>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--      </el-table>-->

      <!--发布文章对话框组件-->
      <el-dialog title='发表文章' :visible.sync='dialogVisible'
                 fullscreen :before-close='handleClose'
                 @closed='onDialogClosedFn'>
        <!--文章发布表单-->
        <el-form :model='pubForm' :rules='pubFormRules' ref='pubFormRef' label-width='100px'>
          <!--标题-->
          <el-form-item label='文章标题' prop='title'>
            <el-input v-model='pubForm.title' placeholder='请输入标题'></el-input>
          </el-form-item>
          <!-- 分类-->
          <el-form-item label='文章分类' prop='cate_id'>
            <el-select v-model='pubForm.cate_id' placeholder='请选择分类' style='width: 100%'>
              <!-- 循环渲染分类的可选项 -->
              <el-option v-for='item in cateList'
                         :label='item.cate_name'
                         :value='item.id'
                         :key='item.id'>
              </el-option>
            </el-select>
          </el-form-item>

          <!--内容区域-->
          <el-form-item label='文章内容' prop='content'>
            <!-- quill-editor富文本可以带标签和样式 使用 v-model 进行双向的数据绑定 校验需要自己绑定 -->
            <quill-editor v-model='pubForm.content' @blur='contentChangeFn'></quill-editor>
          </el-form-item>

          <!-- 封面-->
          <el-form-item label='文章封面' prop='cover_img'>
            <!-- 用来显示封面的图片 -->
            <img src='../../assets/images/cover.jpg'
                 alt='' class='cover-img' ref='imgRef' />
            <br />
            <!-- 文件选择框，默认被隐藏 添加选择封面事件-->
            <input type='file'
                   style='display: none'
                   accept='image/*'
                   ref='iptFileRef'
                   @change='onCoverChangeFn' />
            <!-- 选择封面的按钮 -->
            <el-button type='text' @click='chooseImgFn'>+ 选择封面</el-button>
          </el-form-item>

          <!--底部按钮-->
          <el-form-item>
            <el-button type='primary' @click="pubArticleFn('已发布')">发布
            </el-button>
            <el-button type='info' @click="pubArticleFn('草稿')">存为草稿
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getArtClassAPI, getArticleListAPI, uploadArticleAPI } from '@/api'
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'

export default {
  name: 'art_list',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      // 表单对象
      pubForm: {
        // 表单的数据对象
        title: '',
        cate_id: '',
        content: '', // 文章内容
        cover_img: null, // 用户选择的封面图片（null 表示没有选择任何封面）文件
        state: '' // 文章的发布状态，可选值有两个：草稿、已发布
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          {
            required: true,
            message: '请输入文章标题',
            trigger: 'blur' // blur失焦
          },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          {
            required: true,
            message: '请选择文章标题',
            trigger: 'change'
          }
        ],
        // 富文本不是eleui的标签 不能用ui里的校验，需要自己绑定
        content: [
          {
            required: true,
            message: '请输入文章内容',
            trigger: 'change'
          }
        ],
        // 同上
        cover_img: [
          {
            required: true,
            message: '请选择封面',
            trigger: 'change'
          }]
      },
      dialogVisible: false, // 控制发布文章的对话框出现与否
      cateList: [], // 文章分类列表
      artList: [], // 文章的列表数据
      total: 0, // 总数据条数
      artDetail: {} // 文章的详情信息对象
    }
  },
  created () {
    // 获取-文章分类列表
    this.initCateList()
    // 获取-文章列表
    this.initArtListFn()
  },
  methods: {
    // 发布文章对话框关闭前的回调
    // 注意:自带的3种关闭方式: dialog自带的点右上角的x，和按下esc按键和点击半透明蒙层关闭才会走这里，
    // 以及你自己点击设置visible对应变量为false，都会导致关闭前回调触发
    async handleClose (done) {
      // 询问用户是否确认关闭对话框.$confirm提示框 todo promise链式
      const confirmResult = await this.$confirm(
        '此操作将导致文章信息丢失, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err) // 捕获确认框promise对象选择取消时，拒绝状态的结果‘cancel’
      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 初始化文章分类列表
    async initCateList () {
      const { data: res } = await getArtClassAPI()
      if (res.code === 0) {
        this.cateList = res.data
      }
    },
    // 初始化文章列表
    async initArtListFn () {
      const { data: res } = await getArticleListAPI(this.q)
      if (res.code !== 0) return this.$message.error('获取文章列表失败!')
      this.artList = res.data
      this.total = res.total
    },
    // 发布文章触发对话框
    showPubDialogFn () {
      this.dialogVisible = true
    },
    // 对话框关闭事件
    onDialogClosedFn () {
      // 清空pubform
      this.$refs.pubFormRef.resetFields()
      // 因为这个变量对应的标签不是表单v-model绑定的, 所以需要单独控制
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    // 重置按钮
    resetListFn () {
      // 1. 重置查询参数对象
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      // 2. 重新发起请求
      this.initArtListFn()
    },
    // 选择封面按钮->点击事件->让文件选择窗口出现
    chooseImgFn () {
      this.$refs.iptFileRef.click() // 用js模拟一次点击事件动作 弹窗
    },
    // 用户选择封面封面的事件
    onCoverChangeFn (e) {
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择封面 置空
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg) // js不能写路径 用import导入
      } else {
        // 用户选择了封面 todo 方法1
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      // 表单校验封面。通过校验红字消失
      this.$refs.pubFormRef.validateField('cover_img')
    },

    // 发布/草稿按钮事件
    pubArticleFn (state) {
      // 1. 设置发布状态
      this.pubForm.state = state // 保存到统一表单

      // 2. 兜底校验
      this.$refs.pubFormRef.validate(async (valid) => {
        if (valid) { // 通过校验
          console.log(this.pubForm)
          const fd = new FormData() // 准备一个表单数据对象的容器 FormData是专门为了装文件和其他参数的
          // 格式fd.append(’参数名‘，值) 追加属性
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('content', this.pubForm.content)
          fd.append('state', this.pubForm.state)
          // 发给后台
          const { data: res } = await uploadArticleAPI(fd)
          if (res.code !== 0) return this.$message.error('发布文章失败！')
          this.$message.success('发布文章成功！')
          // 调用对话框关闭
          this.onDialogClosedFn()
        } else {
          this.$message.error('请完善文章信息！')
        }
      })
    },
    // 富文本编辑器内容改变 触发校验
    contentChangeFn () {
      // 校验文化在哪个内容，进这里走一次content校验
      this.$refs.pubFormRef.validateField('content')
    }
  }
}
</script>

<style lang='less' scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .btn-pub {
    margin-top: 5px;
  }
}

// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

.el-pagination {
  margin-top: 15px;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;

  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
