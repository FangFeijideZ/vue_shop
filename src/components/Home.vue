<template>
    <el-container>
        <!-- 上面头部区域 -->
        <el-header>
            <div class="header-left">
                <img src="../assets/111.jpg" alt="">
                <span>鸭子姐姐后台管理系统</span>
            </div>
            <el-button type="info" v-on:click="loginout" class="info">退出登录</el-button>
        </el-header>
        <!-- 下面主体区域 -->
        <el-container>
            <!-- 左侧边栏 -->
            <el-aside v-bind:width="isCollapse?'65px':'200px'">
                <!-- 折叠按钮 -->
                <div class="toggle-button" v-on:click="togglecollapse">
                    <!-- 开关 -->
                    <el-switch v-model="value2"></el-switch>
                </div>
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" v-bind:unique-opened="true" v-bind:collapse="isCollapse" v-bind:collapse-transition="false" v-bind:router="true" v-bind:default-active="activePath">
                    <!-- 这是一级菜单 -->
                    <el-submenu v-bind:index="itme.id+''" v-for="itme in meunlist" v-bind:key="itme.id">
                        <!-- 这是一级菜单的模板 -->
                        <template slot="title">
                            <i v-bind:class="iconsObj[itme.id]"></i>
                            <span>{{itme.authName}}</span>
                        </template>
                        <!-- 这是二级菜单 -->
                        <el-menu-item v-bind:index="'/'+subItem.path" v-for="subItem in itme.children" v-bind:key="subItem.id" v-on:click="navState('/'+subItem.path)">
                            <!-- 这是二级菜单的模板 -->
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧主体内容 -->
            <el-main>
                <!-- 主页子路由占位 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                // 所有菜单列表
                meunlist:[],
                // 导航栏的ico图标
                iconsObj:{
                    '125':'iconfont icon-user',
                    '103':'iconfont icon-tijikongjian',
                    '101':'iconfont icon-shangpin',
                    '102':'iconfont icon-danju',
                    '145':'iconfont icon-baobiao'
                },
                // 切换导航栏的状态,根据状态切换时设置不同的宽度
                isCollapse:false,
                // 初始化的时候开关的状态
                value2: true,
                // 导航栏切换时的动态路由
                activePath:''
            }
        },
        created() {
            this.getMenuList()
        },
        methods:{
            // 退出登录是清除token,然后跳转到登录页面
            loginout(){
                // 清空本地存储中的token
                window.sessionStorage.clear();
                // 清空后跳转到login登录页
                this.$router.push('/login')
            },
            // 获取所有菜单列表
            getMenuList(){
                this.$http.get('/menus').then(res=>{
                    // console.log(res);
                    if(res.data.meta.status !== 200){
                        return this.$message.error(res.meta.msg)
                    }else{
                        this.meunlist=res.data.data
                        // console.log(this.meunlist);
                    }
                })
            },
            // 关闭或打开侧边栏
            togglecollapse(){
                this.isCollapse = !this.isCollapse
            },
            // 导航栏切换时的动态路由
            navState(activePath){
                this.activePath=activePath
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-container{
        height: 100%;
        .el-header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 0;
            background-color: #373d41;
            .header-left{
                display: flex;
                align-items: center;
                color:#fff;
                font-size: 20px;
                span{
                    margin-left: 15px;
                };
                img{
                    border-radius: 50%
                }
            }
        }
        .el-container{
            .el-aside{
                background-color: #333744;
                .toggle-button{
                    color: #fff;
                    letter-spacing: 0.2em;
                    cursor:pointer;
                    margin-left: 11px
                };
                .el-menu {
                    border-right: none;
                    .iconfont{
                        margin-right: 10px;
                    }
                } 
            }
            .el-main{
                background-color: #eaedf1;
            }
        }
    }
</style>
