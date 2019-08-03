<template>
    <div>
        <el-button type="info" v-on:click="loginout" class="info">退出登录</el-button>
    </div>
</template>

<script>
    export default {
        methods:{
            loginout(){
                // 清空本地存储中的token
                window.sessionStorage.clear();
                // 清空后跳转到login登录页
                this.$router.push('/login')
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
