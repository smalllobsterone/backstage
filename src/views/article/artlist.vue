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
          <!-- 当在option标签进行选择时 q对象已经双向改变 故筛选只需要重新请求即可-->
          <el-button type='primary' style='margin-top: 4px' size='small' @click='initArtListFn'>筛选</el-button>
          <el-button type='info' style='margin-top: 4px' size='small' @click='resetListFn'>重置</el-button>
        </el-form>
        <!-- 发表文章-->
        <el-button type='primary' size='small'
                   class='btn-pub' @click='showPubDialogFn'>发表文章
        </el-button>
      </div>

      <!--文章表格区域 -->
      <el-table :data='artList' style='width: 100%' border stripe>
        <!-- 点击文章标题显示详情-->
        <el-table-column label='文章标题' prop='title'>
          <template v-slot='scope'>
            <!--作用域插槽 绑row 拿到文章id 提示用户标题可点击-->
            <el-link type='primary' @click='showDetailFn(scope.row.id)'>
              {{ scope.row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label='分类' prop='cate_name'></el-table-column>
        <el-table-column label='发表时间' prop='pub_date'>
          <!--el-table-column是scope todo 作用域插槽  单独自定义-->
          <template v-slot='scope'>
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label='状态' prop='state'></el-table-column>
        <el-table-column label='操作'>
          <template v-slot='{ row }'>
            <el-button type='danger' size='mini' @click='removeFn(row.id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page.sync='q.pagenum'
        :page-sizes='[2, 3, 5, 10]'
        :page-size.sync='q.pagesize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='total'>
        <!--  .sync监听q中的页码  :page-size.sync="q.pagesize" 每页条目 双向绑定-->
      </el-pagination>

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

      <!--文章详情的对话框-->
      <el-dialog title='文章预览' :visible.sync='contentVisible' width='80%'>
        <h1 class='title'>{{ artDetail.title }}</h1>

        <div class='info'>
          <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
          <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
          <span>所属分类：{{ artDetail.cate_name }}</span>
          <span>状态：{{ artDetail.state }}</span>
        </div>
        <!-- 分割线 -->
        <el-divider></el-divider>
        <!-- 文章的封面 后台值返回后半段地址，所以需要拼接 v-if有值时才执行-->
        <!--<img v-if='artDetail.cover_img' :src="'http://big-event-vue-api-t.itheima.net' + artDetail.cover_img" alt='' />-->
        <!-- 优化-->
        <img :src='baseURL2 + artDetail.cover_img' alt='' />
        <!-- 文章的详情 使用v-html 否则还是文本插值 会显示标签 -->
        <div v-html='artDetail.content' class='detail-box'></div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { delArticleAPI, getArtClassAPI, getArticleDetailAPI, getArticleListAPI, uploadArticleAPI } from '@/api'
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'
// 导入基地址
import { baseURL } from '@/untils/request'

export default {
  name: 'art_list',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1, // 默认拿第一页的数据
        pagesize: 2, // 默认当前页需要几条数据（传递给后台，后台就返回几个）
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
      contentVisible: false, // 控制文章详情的对话框
      cateList: [], // 文章分类列表
      artList: [], // 文章的列表数据
      total: 0, // 总数据条数
      artDetail: {}, // 文章详情
      baseURL2: baseURL
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
    // 初始化文章分类
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
      this.artList = res.data // 保存当前列表（有分页，不是所有） 成功后台返回total和data
      this.total = res.total // 保存总数
    },
    // 获取文章详情点击事件
    async showDetailFn (Artid) {
      const res = await getArticleDetailAPI(Artid)
      // 文档两个data
      this.artDetail = res.data.data
      // 展示对话框
      this.contentVisible = true
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
      // 1. 重置回归第一页 清空分类id和状态两个属性
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
    pubArticleFn (str) {
      // 1. 设置发布状态
      this.pubForm.state = str // 保存到统一表单

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
          // 再次请求 刷新文章列表
          this.initArtListFn()
        } else {
          this.$message.error('请完善文章信息！')
        }
      })
    },
    // 富文本编辑器内容改变 触发校验
    contentChangeFn () {
      // 校验文化在哪个内容，进这里走一次content校验
      this.$refs.pubFormRef.validateField('content')
    },
    // 完成分页功能
    handleSizeChange (val) {
      // 最大页数 发生了变化 当q对象对应的属性改变，双向绑定的值也会变，此时再重新请求即可
      // 如由pagesize由2变3，此时重新请求就会改变页码
      // 为 pagesize 赋值
      this.q.pagesize = val
      // 默认展示第一页数据 避免出现偶发性因为网络后一条比前一条先加载完而不显示出来的问题
      this.q.pagenum = 1
      // 重新发起请求
      this.initArtListFn()
    },
    // 当前页码值发生了变化
    handleCurrentChange (val) {
      this.q.pagenum = val
      // 重新发起请求
      this.initArtListFn()
    },
    // 删除
    async removeFn (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err) // 捕获确认框promise对象选择取消时，拒绝状态的结果‘cancel’
      // 2. 取消了删除
      if (confirmResult === 'cancel') return
      // 执行删除的操作
      const { data: res } = await delArticleAPI(id)
      if (res.code !== 0) return this.$message.error('删除失败!')
      this.$message.success('删除成功!')
      // 在删除最后一条，不出现数据 需要手动返回页码
      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) {
          this.q.pagenum--
        }
      }
      // 携带原有的q参数 重新获取列表
      this.initArtListFn()

      // 问题:在最后一页，删除最后一条时，虽然页码能回到上一页，但是数据没有出现
      // 原因:发现network里参数q. pagenum的值不会自己回到上一页，因为你的代码里没有修改过这个q.pagenum值用getArticleFn方法，带着之前的参数请求去了所以没数据
      // 解决:在调用接口以后，刷新数组列表之前,对页码最一下处理
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
