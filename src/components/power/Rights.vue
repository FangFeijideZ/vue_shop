// 结构
<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
                <el-table-column prop="path" label="路径" width="380"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <!-- 权限等级按钮 -->
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==0" :hit="true">一级</el-tag>
                        <el-tag v-else-if="scope.row.level==1" type="success" :hit="true">二级</el-tag>
                        <el-tag v-else type="warning" :hit="true">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

// 行为
<script>
    export default {
        data(){
            return {
                rightsList:[]
            }
        },
        created(){
            this.getRightsList()
        },
        methods:{
            // 获取全部权限列表
            getRightsList(){
                this.$http.get('rights/list').then(res=>{
                    // console.log(res);
                    if(res.data.meta.status !== 200){
                        return this.$message(res.data.meta.msg)
                    }else{
                        this.rightsList=res.data.data;
                        // console.log(this.rightsList);
                    }
                })
            }
        }
    }
</script>

// 样式
<style lang="less" scoped>

</style>
