<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-button type="primary" @click="addDialogVisible">添加分类</el-button>
            <!-- 表格区域 -->
            <tree-table class="treeTable" :data="catelist" :columns="columns" show-index border :selection-type="false" :expand-type="false" :show-row-hover="false">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted===false"></i>
                    <i class="el-icon-error" style="color:red" v-else></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0" :hit="true">一级</el-tag>
                    <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success" :hit="true">二级</el-tag>
                    <el-tag size="mini" v-else type="warning" :hit="true">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button icon="el-icon-edit" type="primary" size="mini">编辑</el-button >
                    <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button >
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 5, 10, 15, 30, 50]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 弹出添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="40%" @close="addCateDialogCloset">
            <!-- 中间主体内容区域 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <!-- 添加分类名称 -->
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <!-- 添加父级分类 -->
                <el-form-item label="父级分类:">
                    <!-- options 数据的来源 -->
                    <!-- porps 级联选择器的配置选项 -->
                    <!-- change 监听级联选择器事件变化 -->
                    <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select></el-cascader>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                // 全部数据列表
                catelist:[],
                // 所有父级分类列表
                parentCateList:[],
                // 级联选择器双向绑定的数据
                selectedKeys:[],
                // 数据总条数
                total:0,
                // 显示与隐藏添加分类对话框
                addCateDialogVisible:false,
                // 添加分类要用的数据对象
                addCateForm:{
                    // 父级分类的名称
                    cat_name:'',
                    // 父级分类的id
                    cat_pid:0,
                    // 分类的等级
                    cat_level:0
                },
                // 级联选择器的配置选项
                cascaderProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                // 查询商品分类时用的数据
                queryInfo:{
                    // 显示几级分类
                    type:3,
                    // 当前是第几页
                    pagenum:1,
                    // 当前每页显示多少条
                    pagesize:5
                },
                // 表格的每一列数据,
                columns:[
                    {
                        label:'分类名称',
                        prop:'cat_name'
                    },{
                        label:'是否有效',
                        type:'template',
                        template:'isok'
                    },{
                        label:'排序',
                        type:'template',
                        template:'order'
                    },{
                        label:'操作',
                        type:'template',
                        template:'opt'
                    }
                ],
                // 添加分类的表单验证规则
                addCateFormRules:{
                    cat_name:[
                        { required: true, message: '请输入分类名称', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            // 获取全部商品分类数据
            async getCateList(){
                const {data:res} = await this.$http.get('categories',{params:this.queryInfo});
                // console.log(res);
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)        
                }else{
                    this.catelist=res.data.result;
                    this.total=res.data.total;
                    // console.log(this.catelist);
                    // console.log(this.total);
                }
            },
            // 添加分类获取全部分类列表
            async getParentCateList(){
                const {data:res}=await this.$http.get('categories',{params:{type:2}});
                // console.log(res);
                if(res.meta.status !== 200){
                    return this.$message.error('res.meta.msg')
                }else{
                    this.parentCateList=res.data;
                    // console.log(this.parentCateList);
                }
            },
            // 监听每页显示多少条数据的改变
            handleSizeChange(newSize){
                this.queryInfo.pagesize=newSize;
                this.getCateList()
            },
            // 监听当前是第几页的改变
            handleCurrentChange(newPage){
                this.queryInfo.pagenum=newPage;
                this.getCateList()
            },
            // 弹出添加分类对话框
            addDialogVisible(){
                // 调用获取分类函数
                this.getParentCateList();
                this.addCateDialogVisible=true
            },
            // 重置添加分类对话框的内容
            addCateDialogCloset(){
                // this.$refs.addCateFormRef.resetFields();
                // this.selectedKeys=[];
                // this.addCateForm.cat_level = 0;
                // this.addCateForm.cat_pid = 0
            },
            // 监听级联选择器选择项的变化
            parentCateChanged(){
                console.log(this.selectedKeys);
                if(this.selectedKeys.length>0){
                    // 所选的父级分类的Id取最后一级
                    this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1];
                    // 所选分类的等级,选了几级分类就是几级
                    this.addCateForm.cat_level=this.selectedKeys.length;
                    return
                }else{
                    // 父级分类的id
                    this.addCateForm.cat_pid=0;
                    // 父级分类的等级
                    this.addCateForm.cat_level=0
                }
            },
            // 点击确定发送添加分类请求
            addCate(){
                console.log(this.addCateForm);
                this.$refs.addCateFormRef.validate(valid=>{
                    // console.log(valid);
                    if(!valid){
                        return
                    };
                    this.$http.post('categories',this.addCateForm).then(res=>{
                        // console.log(res);
                        if(res.data.meta.status !==201){
                            return this.$message.error(res.data.meta.msg)
                        }else{
                            this.$message.success(res.data.meta.msg);
                            this.getCateList();
                            this.addCateDialogVisible=false
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .treeTable{
        margin-top: 15px
    }
    .el-cascader{
        width: 100%
    }
</style>
