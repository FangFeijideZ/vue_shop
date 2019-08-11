<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索框区域 gutter是设置左右内边距-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goodsAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- tab表格区域 -->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
                <el-table-column label="创建时间" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateInfo(scope.row.goods_id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeInfo(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
             <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 3, 5, 10, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 编辑商品弹出的对话框 -->
        <el-dialog
            title="编辑商品"
            :visible.sync="updateVisible"
            width="40%"
            @close="updateClose">
            <!-- 编辑商品信息的表单 -->
            <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="100px">
                <el-form-item label="商品名称:" prop="goods_name">
                    <el-input v-model="updateForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格:" prop="goods_price">
                    <el-input v-model="updateForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量:" prop="goods_weight">
                    <el-input v-model="updateForm.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量:" prop="goods_number">
                    <el-input v-model="updateForm.goods_number" type="number"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateFormId">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                // 全部商品列表
                goodslist:[],
                // 当前编辑的商品信息
                updateForm:{
                    goods_id:'goods_id',
                    goods_name:'goods_name',
                    goods_price:'goods_price',
                    goods_number:'goods_number',
                    goods_weight:'goods_weight'
                },
                // 查询信息
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:5
                },
                // 总数据条数
                total:0,
                // 控制编辑商对话框的显示与隐藏
                updateVisible:false,
                // 编辑商品的表单验证规则
                updateFormRules:{
                    goods_name:[
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_price:[
                        { required: true, message: '请输入商品价格', trigger: 'blur' }
                    ],
                    goods_weight:[
                        { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_number:[
                        { required: true, message: '请输入商品数量', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.getGoodsList()
        },
        methods: {
            // 获取全部数据列表的请求
            async getGoodsList(){
                const {data:res}=await this.$http.get('goods',{params:this.queryInfo});
                // console.log(res);
                if(res.meta.status !== 200){
                    return this.$message.error(res.meat.msg)
                }else{
                    this.goodslist=res.data.goods;
                    this.total=res.data.total
                }
            },
            // 监听每页显示数据条数的变化
            handleSizeChange(newSize){
                this.queryInfo.pagesize=newSize;
                this.getGoodsList()
            },
            // 监听当前页是第几页的变化
            handleCurrentChange(newPage){
                this.queryInfo.pagenum=newPage;
                this.getGoodsList()
            },
            // 根据id编辑商品信息
            updateInfo(id){
                // console.log(id);
                this.$http.get('goods/'+id).then(res=>{
                    // console.log(res);
                    if(res.data.meta.status !== 200){
                        return thhp.$message.error(res.data.meta.msg)
                    }else{
                        this.updateForm=res.data.data;
                        this.updateVisible=true;
                        // console.log(this.updateForm);
                    }
                })
            },
            // 监听关闭编辑商品对话框关闭的事件
            updateClose(){
                this.$refs.updateFormRef.resetFields()
            },
            // 点击确定按钮发送修改请求
            updateFormId(){
                this.$refs.updateFormRef.validate(valid=>{
                    // console.log(valid);
                    if(!valid){
                        return
                    };
                    this.$http.put('goods/'+this.updateForm.goods_id,this.updateForm).then(res=>{
                        // console.log(res);
                        if(res.data.meta.status !== 200){
                            return this.$message.error(res.data.meta.msg)
                        }else{
                            this.$message.success('编辑商品完成');
                            this.updateVisible=false;
                            this.getGoodsList()
                        }
                    })
                })
            },
            // 根据id删除商品
            removeInfo(id){
                // console.log(id);
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(()=>{
                    this.$http.delete('goods/'+id).then(res=>{
                        // console.log(res);
                        if(res.data.meta.status !==200){
                            return this.$message.error(res.data.meta.msg)
                        }else{
                            this.$message.success(res.data.meta.msg);
                            this.getGoodsList()
                        }
                    })
                }).catch(()=>{
                     this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            // 用链式编程跳转到添加商品页面
            goodsAddPage(){
                this.$router.push('goods/add')
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
