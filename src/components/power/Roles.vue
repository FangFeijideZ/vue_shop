// 结构
<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
            <!-- 角色列表 -->
            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 一级权限 -->
                        <el-row :class="['rolesbottom',index1===0?'rolestop':'','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
                            <el-col :span="5">
                                <el-tag @close="removeRight(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <!-- 二级权限 -->
                                <el-row :class="[index2===0?'':'rolestop','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" @close="removeRight(scope.row,item2.id)" closable>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <!-- 三级权限 -->
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" @close="removeRight(scope.row,item3.id)" closable>{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述" width="280"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRolesInfo(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesInfo(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRightDialogVisible(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色弹出的对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addDialogVisible"
            width="40%"
            v-on:close="addDialogCloset">
            <!-- 主体内容区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑角色弹出的对话框 -->
        <el-dialog
            title="修改角色"
            :visible.sync="editDialogVisible"
            width="40%"
            v-on:close="editDialogCloset">
            <!-- 主体内容区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoles">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限弹出的对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="distriDialogVisible"
            width="40%"
            @close="setRightDialogClosed">
            <!-- 主体内容区域 -->
            <el-tree :data="rightsList" :props="treeProps" ref="treeRef" node-key="id" :default-checked-keys="defkeys" show-checkbox default-expand-all></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="distriDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

// 行为
<script>
    export default {
        data(){
            return {
                // 全部角色列表
                rolesList:[],
                // 全部权限列表
                rightsList:[],
                // 分配角色权限要用的id
                rolesId:'',
                // 修改角色弹出的对话框
                editDialogVisible:false,
                // 添加角色弹出的对话框
                addDialogVisible:false,
                // 分配权限弹出的对话框
                distriDialogVisible:false,
                // 修改角色用到的id
                editForm:{},
                // 添加角色用到的数据
                addForm:{
                    roleName:'',
                    roleDesc:''
                },
                // 树形控件
                treeProps:{
                    label:'authName',
                    children:'children'
                },
                // 树形控件默认勾选的项目的id
                defkeys:[],
                // 修改角色匹配的数据规则
                editFormRules:{
                    roleName:[
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    roleDesc:[
                        { required: true, message: '请输入角色描述', trigger: 'blur' },
                        { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                    ]
                },
                // 添加角色匹配的数据规则
                addFormRules:{
                    roleName:[
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    roleDesc:[
                        { required: true, message: '请输入角色描述', trigger: 'blur' },
                        { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        // 在created生命周期,页面一加载完成就调用获取全部角色列表函数
        created(){
            this.getRolesList()
        },
        methods: {
            // 发送请求获取全部角色列表
            async getRolesList(){
                const {data:res}=await this.$http.get('roles');
                if(res.meta.status !== 200){
                    return this.$message.error(res.data.msg)
                };
                this.rolesList=res.data;
                // console.log(this.rolesList);
            },
            // 点击确定发送修改角色请求
            editRoles(){
                this.$refs.editFormRef.validate(valid=>{
                    this.editDialogVisible=false;
                    this.$http.put('roles/'+this.editForm.roleId,{
                        roleName:this.editForm.roleName,
                        roleDesc:this.editForm.roleDesc
                    }).then(res=>{
                        // console.log(res);
                        if(res.data.meta.status !== 200){
                            return this.$message.error(res.data.meta.msg)
                        }else{
                            this.$message.success('修改成功')
                            this.getRolesList()
                        }
                    })
                })
            },
            // 点击确定发送添加角色请求
            addRoles(){
                this.$refs.addFormRef.validate(valid=>{
                    this.addDialogVisible=false;
                    this.$http.post('roles',{
                        roleName:this.addForm.roleName,
                        roleDesc:this.addForm.roleDesc,
                    }).then(res=>{
                        console.log(res);
                        if(res.data.meta.status !== 201){
                            return this.$message.error(res.data.meta.msg)
                        }else{
                            this.$message.success(res.data.meta.msg)
                            this.getRolesList()
                        }
                    })
                })
            },
            // 点击确定发送删除角色请求
            removeRolesInfo(id){
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', { confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(()=>{
                        this.$http.delete('roles/'+id).then(res=>{
                        console.log(res);
                        if(res.data.meta.status !== 200){
                            return this.$message.error(res.data.meta.msg)
                        }else{
                            this.$message.success(res.data.meta.msg)
                            this.getRolesList()
                        }
                    })
                }).catch(()=>{
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            // 清空重置编辑角色对话框的内容
            editDialogCloset(){
                this.$refs.editFormRef.resetFields()
            },
            // 清空添加角色对话框的内容
            addDialogCloset(){
                this.$refs.addFormRef.resetFields()
            },
            // 点击编辑按钮弹出修改角色信息对话框
            editRolesInfo(id){
                this.editDialogVisible=true;
                this.$http.get('roles/'+id).then(res=>{
                    // console.log(res);
                    if(res.data.meta.status !== 200){
                        return this.$message.error(res.data.meta.msg)
                    }else{
                        this.editForm=res.data.data;
                    }
                })
            },
            // 点击确定发送删除角色权限请求
            removeRight(role,rightId){
                // console.log(role);
                // console.log(rightId);
               this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', { confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(()=>{
                        this.$http.delete(`roles/${role.id}/rights/${rightId}`).then(res=>{
                            console.log(res);
                            if(res.data.meta.status !== 200){
                                return this.$message.error(res.data.meta.msg)
                            }else{
                                this.$message.success(res.data.meta.msg);
                                role.children=res.data.data
                            }
                        })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })         
                })
            },
            // 点击分配权限按钮弹出分配权限对话框
            setRightDialogVisible(role){
                this.rolesId=role.id;
                this.$http.get('rights/tree').then(res=>{
                    // console.log(res);
                    if(res.data.meta.status !== 200){
                        return this.$message.error(res.data.meta.msg)
                    }else{
                        this.rightsList=res.data.data
                        // console.log(this.rightsList);
                    }
                });
                // 在分配权限对话框弹出前调用获取角色权限id的函数
                this.getLeafKeys(role,this.defkeys);
                this.distriDialogVisible=true;
            },
            // 点击打开分配权限的时候获取角色权限的id
            getLeafKeys(node,arr){
                if(!node.children){
                    return arr.push(node.id)
                }else{
                    node.children.forEach(value=>this.getLeafKeys(value,arr))
                }
            },
            // 点击关闭分配权限的时候清除角色权限的id
            setRightDialogClosed(){
                this.defkeys=[]
            },
            // 点击确定发送分配权限的请求
            allotRights(){
                // 获取被选中权限的id
                const keys=[
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ];
                // 利用join将数组转成字符串
                const idString = keys.join(',')
                // console.log(idString);
                this.$http.post('roles/'+this.rolesId+'/rights',{
                    rids:idString
                }).then(res=>{
                    // console.log(res);
                    if(res.data.meta.status !== 200){
                        return this.$message.error(res.data.meta.msg)
                    }else{
                        this.$message.success('分配权限成功');
                        this.distriDialogVisible=false;
                        // this.rightsList=res.data.data;
                        this.getRolesList()
                    }
                })
            }
        }
    }
</script>

// 样式
<style lang="less" scoped>
    .rolesbottom{
        border-bottom: 1px solid #eee
    };
    .rolestop{
        border-top: 1px solid #eee
    };
    .el-col{
        margin: 10px 0;
        .el-tag{
            margin-right: 10px;
        }
    };
    .vcenter {
        display: flex;
        align-items: center
    }
</style>
