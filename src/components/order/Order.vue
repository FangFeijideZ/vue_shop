<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row v-bind:gutter="20">
                <el-col v-bind:span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 订单列表区域 -->
            <el-table :data="orderlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格" width="180"></el-table-column>
                <el-table-column label="是否付款" width="100px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.order_pay==0" :hit="true" type="danger">未付款</el-tag>
                        <el-tag v-else-if="scope.row.order_pay==1" :hit="true" type="warning">待付款</el-tag>
                        <el-tag v-else :hit="true">已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="80px"></el-table-column>
                <el-table-column label="下单时间" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateInfoId"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
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
        <!-- 修改地址弹出的对话框 -->
        <el-dialog
            title="修改地址"
            :visible.sync="updateVisible"
            width="40%"
            @close="updateClose">
            <!-- 编辑商品信息的表单 -->
            <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="100px">
                <el-form-item label="省市区/县:" prop="updateresult1">
                    <el-cascader
                    v-model="updateForm.updateresult1"
                    :options="cityData"
                    :props="{ expandTrigger: 'hover' }">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址:" prop="updateresult2">
                    <el-input v-model="updateForm.updateresult2"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 查看物流信息弹出的对话框 -->
        <el-dialog
            title="查看物流"
            :visible.sync="progressVisible"
            width="40%">
            <el-timeline>
                <el-timeline-item
                v-for="(activity, index) in progressInfo"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
    // 引入全部的地址
    import cityData from './citydata.js'
    export default {
        data() {
            return {
                // 全部订单列表
                orderlist:[],
                // 获取订单要用的查询信息
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:5
                },
                // 总数据条数
                total:0,
                // 控制修改地址对话框的显示与隐藏
                updateVisible:false,
                // 当前修改地址的信息
                updateForm:{
                    updateresult1:[],
                    updateresult2:''
                },
                // 修改地址的表单验证规则
                updateFormRules:{
                    updateresult1:[
                        { required: true, message: '请输入省市区/县', trigger: 'blur' }
                    ],
                    updateresult2:[
                        { required: true, message: '请输入详细地址', trigger: 'blur' }
                    ]
                },
                // 全部的地址
                cityData:cityData,
                // 控制查看物流对话框的显示与隐藏
                progressVisible:false,
                // 查看物流表单的数据
                progressInfo:[]
            }
        },
        created() {
            this.getOrderList()
        },
        methods:{
            // 获取全部订单列表的请求
            async getOrderList(){
                const {data:res}=await this.$http.get('orders',{params:this.queryInfo});
                // console.log(res);
                if(res.meta.status !== 200){
                    return this.$message.error(res.meat.msg)
                }else{
                    this.orderlist=res.data.goods;
                    this.total=res.data.total
                    // console.log(this.orderlist);
                }
            },
            // 根据id修改地址
            updateInfoId(){
                // console.log(id);
                this.updateVisible=true;
                
            },
            // 查看物流信息对话框
            showProgressBox(){
                this.$http.get('kuaidi/106975712662').then(res=>{
                    // console.log(res);
                    if(res.data.meta.status !== 200){
                        return thhp.$message.error(res.data.meta.msg)
                    }else{
                        this.progressInfo=res.data.data;
                        this.progressVisible=true;
                        // console.log(this.progressInfo);
                    }
                })
            },
            // 监听每页显示数据条数的变化
            handleSizeChange(newSize){
                this.queryInfo.pagesize=newSize;
                this.getOrderList()
            },
            // 监听当前页是第几页的变化
            handleCurrentChange(newPage){
                this.queryInfo.pagenum=newPage;
                this.getOrderList()
            },
            // 监听关闭修改地址对话框关闭的事件
            updateClose(){
                this.$refs.updateFormRef.resetFields()
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-cascader{
        width: 100%
    }
    @import '../../plugins/timeline/timeline.css';
    @import '../../plugins/timeline-item/timeline-item.css';
</style>
