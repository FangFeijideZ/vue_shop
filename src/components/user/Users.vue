<template>
    <div class="userlist">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row v-bind:gutter="20">
                <el-col v-bind:span="8">
                    <el-input placeholder="请输入内容" class="input-with-select"></el-input>
                </el-col>
                <el-col v-bind:span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
        </el-card>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:2
                },
                userlist:[],
                total:0
            }
        },
        created() {
            this.getUserList()
        },
        methods:{
            getUserList(){
                this.$http.get('/users',{params:this.queryInfo}).then(res=>{
                    console.log(res);
                    if(res.data.meta.status !== 200){
                        return this.$message.error(res.data.meta.msg)
                    }else{
                        this.userlist=res.data.data.users;
                        this.total=res.data.data.total
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .userlist{
        .el-breadcrumb{
            margin-bottom: 15px;
        }
    }
</style>

