// 结构
<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="111">
            </div>
            <!-- 登录表单区域 -->
            <el-form label-width="0px" class="login_form" v-bind:model="loginForm" v-bind:rules="loginRules" ref="loginRef">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" v-on:click="login" class="login">登录</el-button><br/>
                    <el-button type="info" v-on:click="setLoginRef" class="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

// 行为
<script>
    export default {
        data() {
            return {
                // 输入框表单数据
                loginForm:{
                    username:'admin',
                    password:'123456'
                },
                // 判断数据格式
                loginRules:{
                    uesrname:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            // 重置清空数据
            setLoginRef () {
                // console.log(this);
                this.$refs.loginRef.resetFields()
            },
            // 请求登录数据
            login () {
                // 对表单进行验证 async用来设置函数为异步
                this.$refs.loginRef.validate(async valid => {
                    // console.log(valid);
                    if (!valid) {
                        return
                    };
                    // await用来简化promise数据 {data:res}用来解构赋值对象
                    const { data: res } = await this.$http.post('/login', this.loginForm)
                    console.log(res)
                    if (res.meta.status !== 200) {
                        return this.$message.error('登录失败')
                    } else {
                        this.$message.success('登录成功')
                    };
                    // 登录成功后把后台返回的token设置到本地存储里面下次请求的时候携带有token就可以不用登录进主页
                    window.sessionStorage.setItem('token', res.data.token)
                    // 编程式导航用作路由
                    this.$router.push('/home')
                })
            }
        }
    }
</script>

// 样式
<style lang="less" scoped>
    .login_container{
        height: 100%;
        background-color: #2b4b6b;
        .login_box{
            width: 450px;
            height: 300px;
            background-color: #fff;
            border-radius: 10px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            .avatar_box{
                position: absolute;
                left: 50%;
                transform: translate(-50%,-50%);
                height: 100px;
                width: 100px;
                border: 1px solid #eee;
                padding: 10px;
                border-radius: 50%;
                box-shadow: 0 0 10px #ddd;
                background-color: #fff;
                img{
                    height: 100%;
                    width: 100%;
                    border-radius: 50%;
                    background-color: #eee;
                }
            }
            .login_form{
                position: absolute;
                bottom: 0;
                width: 100%;
                box-sizing: border-box;
                padding: 0 15px;
                .btns{
                width: 100%;
                display: flex;
                justify-content:space-around;
                    .login{
                        width:420px;
                        margin-bottom: 15px;
                    }
                    .info{
                        width:420px
                    }
                }
            }
        }
    }
</style>
