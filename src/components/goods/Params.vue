<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 警告提示区域 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
            <!-- 级联选择器 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader expand-trigger="hover" :options="catelist" :props="paramsProps" v-model="selectedParamsKeys" @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <!-- 底部标签页 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="first">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="second">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled">静态属性</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                // 全部分类数据列表
                catelist:[],
                // 级联选择器的props配置项,配置要显示的层级分类
                paramsProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                // 级联选择器内的内容,必须是数组
                selectedParamsKeys:[],
                // 当期默认激活显示的标签页
                activeName:'first'
            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            async getCateList(){
                const {data:res} = await this.$http.get('categories');
                // console.log(res);
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)        
                }else{
                    this.catelist=res.data;
                    // console.log(this.catelist);
                }
            },
            // 级联选择器发送变化时触发的事件
            handleChange(){
                // 判断选择器选中的层级数等不等于3
                if(this.selectedParamsKeys.length!==3){
                    // 不等于3就意味着没有选到3级，就把双向绑定的数据清空，input框中就没有了数据,等于选中到3级分类
                    this.selectedParamsKeys=[];
                    return
                }else{
                    console.log(this.selectedParamsKeys.length)
                }
            },
            // 监听标签页的变化
            handleClick(){
                console.log(this.activeName)
            }
        },
        // 计算属性
        computed: {
            // 判断层级没有选择到3级的话,就返回布尔值给按钮用,控制禁用与开启按钮
            isBtnDisabled(){
                if(this.selectedParamsKeys.length!==3){
                    return true
                }else{
                    return false
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .cat_opt{
        margin: 15px 0
    }
</style>
