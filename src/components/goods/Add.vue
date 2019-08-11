<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 警告提示区域 -->
            <el-alert
            title="添加商品信息"
            type="info"
            center
            show-icon
            :closable="false">
            </el-alert>
            <!-- 步骤进度条 -->
            <el-steps :space="200" :active="activeName-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 左侧对齐的tab标签 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeName" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <!-- 基本信息tab标签 -->
                    <el-tab-pane name="0" label="基本信息">
                        <!-- 表单信息 -->
                        <el-form-item label="商品名称:" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格:" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量:" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量:" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类:" prop="goods_cat">
                            <!-- 级联选择器 -->
                            <el-cascader
                            v-model="addForm.goods_cat"
                            :options="goodsList"
                            expand-trigger="hover"
                            :props="cascaderProps"
                            @change="handleChange"
                            clearable>
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品参数tab标签 -->
                    <el-tab-pane name="1" label="商品参数">商品参数</el-tab-pane>
                    <!-- 商品属性tab标签 -->
                    <el-tab-pane name="2" label="商品属性">商品属性</el-tab-pane>
                    <!-- 商品图片tab标签 -->
                    <el-tab-pane name="3" label="商品图片">
                        <el-upload
                        class="upload-demo"
                        :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        list-type="picture"
                        :headers="headerObj">
                        <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <!-- 商品内容tab标签 -->
                    <el-tab-pane name="4" label="商品内容">
                        <!-- 富文本编辑器 需要安装依懒 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加商品按钮 -->
                        <el-button type="primary" @click="addGoods" class="btnAdd">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog
            title="图片预览"
            :visible.sync="uploadVisible"
            width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'loadsh'
    export default {
        data(){
            return {
                // 进度条的绑定
                activeName:'0',
                // 添加商品发生请求要用的表单数据
                addForm:{
                    goods_name:'',
                    goods_introduce:'',
                    goods_price:0,
                    goods_weight:0,
                    goods_number:0,
                    goods_cat:[],
                    pics:[],
                    attrs:[]
                },
                // 添加商品的表单数据验证规则
                addFormRules:{
                    goods_name:[
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_price:[
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_weight:[
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_number:[
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ]
                },
                // 级联选择器选中项的数据
                // selectedKeys:[],
                // 所有分类数据的列表
                goodsList:[],
                // 动态参数列表
                manyTableData:[],
                // 静态参数列表
                onlyTableData:[],
                // 级联选择器的配置项
                cascaderProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children',
                    checkStrictly: true
                },
                // 图片上传的请求路径
                uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
                // 设置上传图片的请求头携带token
                headerObj:{
                    Authorization:window.sessionStorage.getItem('token')
                },
                // 设置图片预览对话框的显示与隐藏
                uploadVisible:false,
                // 图片预览的路径
                previewPath:''
            }
        },
        created() {
            this.getGoodsList()
        },
        methods:{
            async getGoodsList(){
                const {data:res} = await this.$http.get('categories');
                // console.log(res);
                if(res.meta.status !==200){
                    return this.$message.error(res.meta.msg)
                }else{
                    this.goodsList=res.data;
                    // this.$message.success(res.meta.msg);
                }
            },
            // 监听级联选择器的变化
            handleChange(){
                // console.log(this.addForm.goods_cat);
                // if(this.addForm.goods_cat.length !== 3){
                //     this.addForm.goods_cat=[]
                // }
            },
            // 判断tab栏在第一个并且级联选择器选中的情况
            beforeTabLeave(activeName, oldActiveName){
                // console.log(oldActiveName)
                // console.log(activeName);
                // if(oldActiveName ==='0' && this.addForm.goods_cat.length !== 3){
                //     return false
                // }
            },
            // tab栏切换的触发的事件处理函数
            tabClicked(){
                // console.log(this.activeName);
                if(this.activeName === '1'){
                    this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}}).then(res=>{
                        // console.log(res);
                        if(res.data.meta.status !==200){
                            return this.$message.error(res.data.meta.msg)
                        }else{
                            this.manyTableData=res.data.data
                        }
                    })
                }else if(this.activeName === '2'){
                    this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}}).then(res=>{
                        // console.log(res);
                        if(res.data.meta.status !==200){
                            return this.$message.error(res.data.meta.msg)
                        }else{
                            this.onlyTableData=res.data.data
                        }
                    })
                }
            },
            // 图片上传成功处理函数
            uploadSuccess(response, file, fileList){
                // console.log(response);
                // console.log(file);
                // console.log(fileList);
                this.$message.success(response.meta.msg);
                const picInfo={
                    pic:response.data.tmp_path
                };
                this.addForm.pics.push(picInfo)
                // console.log(this.addForm.pics);
            },
            // 图片上传失败的处理函数
            uploadError(err, file, fileList){
                // console.log(err);
                if(err.meta.status !==200){
                    return this.$message.error(err.meta.msg)
                }else{
                    this.$message.success(err.meta.msg)
                }
            },
            // 图片删除的处理函数
            handleRemove(file){
                // console.log(file);
                const filePath = file.response.data.tmp_path;
                const index = this.addForm.pics.findIndex(x=>{
                    // console.log(x);
                    if(x.pic==filePath){
                        this.addForm.pics.splice(index,1)
                        // console.log(this.addForm.pics);
                    }
                })
            },
            // 图片预览的处理函数
            handlePreview(file){
                // console.log(file);
                // console.log(file.response.data.url);
                this.previewPath=file.response.data.url
                this.uploadVisible=true
            },
            // 点击添加商品按钮 发生请求
            addGoods(){
                this.$refs.addFormRef.validate(valid=>{
                    // console.log(valid);
                    if(!valid){
                        return this.$message.error('请填写必要的表单信息')
                    }else{
                        // 深拷贝addForm对象
                        const form = _.cloneDeep(this.addForm);
                        // 把数组转化为字符串
                        form.goods_cat=form.goods_cat.join(',');
                        // 处理动态参数
                        this.manyTableData.forEach(item =>{
                            const newInfo = {
                                attr_id:item.attr_id,
                                attr_vals:item.attr_value.join(' ')
                            };
                            this.addForm.attrs.push(newInfo)
                        });
                        // 处理静态参数
                        this.onlyTableData.forEach(item =>{
                            const newInfo = {
                                attr_id:item.attr_id,
                                attr_vals:item.attr_value
                            };
                            this.addForm.attrs.push(newInfo)
                        })
                        form.attrs=this.addForm.attrs;
                        // console.log(form);
                        // 发送请求
                        this.$http.post('goods',form).then(res=>{
                            console.log(res);
                            if(res.data.meta.status !==201){
                                return this.$message.error(res.data.meta.msg)
                            }else{
                                this.$message.success(res.data.meta.msg);
                                Vue.$router.push('/goods')
                            }
                        })
                    }
                })
            }
        },
        // 计算属性
        computed: {
            // 级联选择器的id
            cateId(){
                if(this.addForm.goods_cat.length !== 1){
                    return null
                }else{
                    return this.addForm.goods_cat[0]
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-steps{
        margin: 15px 0
    }
    .previewImg{
        width: 100%
    }
    .btnAdd{
        margin: 15px 0
    }
</style>
