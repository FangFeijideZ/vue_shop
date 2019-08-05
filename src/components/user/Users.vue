<template>
    <div class="userlist">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">我爱你--></el-breadcrumb-item>
            <el-breadcrumb-item>么么哒--></el-breadcrumb-item>
            <el-breadcrumb-item>木啊~~~</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row v-bind:gutter="20">
                <el-col v-bind:span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" v-bind:clearable="true" v-on:clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" v-on:click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col v-bind:span="4">
                    <el-button type="primary" v-on:click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table v-bind:data="userlist" v-bind:border="true" v-bind:stripe="true">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <!-- {{scope.row}} -->
                        <el-switch v-model="scope.row.mg_state" v-on:change="userChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" v-bind:enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
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
        <!-- 添加用户弹出的对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="40%"
            v-on:close="addDialogCloset">
            <!-- 主体内容区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            // 自定义验证规则
            var checkMobile = (rule,value,callback) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if(regMobile.test(value)){
                    return callback()
                };
                callback(new Error('请输入11位手机号码(只能是数字)'))
            };
            return {
                queryInfo:{
                    query:'',
                    // 当前是第几页
                    pagenum:1,
                    // 当前每页显示多少条
                    pagesize:5
                },
                userlist:[],
                // 数据总条数
                total:0,
                addDialogVisible:false,
                // 添加表单数据
                addForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                },
                // 添加表单数据验证规则
                addFormRules:{
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                    email:[
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    mobile:[
                        { required: true, message: '请输入手机号码', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.getUserList()
        },
        methods:{
            // 获取用户列表
            getUserList(){
                this.$http.get('/users',{params:this.queryInfo}).then(res=>{
                    // console.log(res);
                    if(res.data.meta.status !== 200){
                        return this.$message.error(res.data.meta.msg)
                    }else{
                        this.userlist=res.data.data.users;
                        this.total=res.data.data.total
                        // console.log(this.total);
                        // console.log(this.userlist);
                    };
                    // getUserList()
                })
            },
            // 获取当前每页显示多少条
            handleSizeChange(newPagesize){
                // console.log(newPagesize);
                this.queryInfo.pagesize=newPagesize;
                this.getUserList()
            },
            // 获取当前是第几页
            handleCurrentChange(newPage){
                // console.log(newPage);
                this.queryInfo.pagenum=newPage;
                this.getUserList()
            },
            // 监听switch开关状态的改变
            userChange(userinfo){
                // console.log(userinfo);
                this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`).then(res=>{
                    // console.log(res);
                    if(res.data.meta.status !==200){
                        userinfo.mg_state = !userinfo.mg_state;
                        return this.$message.error(res.data.meta.msg)
                    }else{
                        this.$message.success(res.data.meta.msg)
                    }
                })
            },
            // 监听添加用户对话框关闭的状态的改变
            addDialogCloset(){
                // 通过ref引用属性 重置表单中的数据
                this.$refs.addFormRef.resetFields()
            },
            // 点击按钮添加用户
            addUser(){
                this.$refs.addFormRef.validate(valid=>{
                    // 添加前的数据校验
                    console.log(valid);
                    this.$http.post('users',this.addForm).then(res=>{
                        if(res.data.meta.status !== 201){
                            // 添加用户失败的弹窗消息
                            return this.$message.error(res.data.meta.msg)
                        }else{
                            // 添加用户成功的弹窗消息
                            this.$message.success(res.data.meta.msg);
                            // 添加用户成功后关闭添加用户对话框
                            this.addDialogVisible=false;
                            // 添加用户成功后重新加载用户列表数据
                            this.getUserList()
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    
</style>

