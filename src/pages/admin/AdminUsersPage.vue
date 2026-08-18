<template>
    <div class="about">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>管理列表</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图区域 -->
      <el-card class="box-card">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                <template #append><el-button @click="getUserList">搜索</el-button></template>
              </el-input></el-col>
            <el-col :span="4">
              <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
            </el-col>
          </el-row>

          <!-- 用户列表 -->
      <div style="height:400px;margin-top: 15px;" class="scrollbar">
        <el-scrollbar style="height:100%"> 
          <el-table :data="userlist" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="用户名称" prop="username"></el-table-column>
            <el-table-column label="用户账号" prop="userId"></el-table-column>
            <el-table-column label="用户类型" prop="userId">
              <template #default="scope">
                <h4 v-if=scope.row.usertype>管理员</h4>
                <h4 v-else>普通用户</h4>
              </template>
            </el-table-column>
            <el-table-column label="操作" >
              <template #default="scope">
                <el-tooltip class="item" effect="dark" content="修改用户" placement="top" :enterable="false">
                  <el-button type="primary" @click="showEditDialog(scope.row.userId)"><el-icon><EditIcon /></el-icon></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="用户主页" placement="top" :enterable="false">
                  <el-button type="warning" @click="touserhome(scope.row.userId)"><el-icon><SearchIcon /></el-icon></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
                  <el-button type="danger" @click="removeUserById(scope.row.userId)"><el-icon><DeleteIcon /></el-icon></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
          <!-- 分页区域 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNo"
            :page-sizes="[3, 4, 5, 10]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>

      </el-card>
      <AdminUserCreateDialog v-model="dialogVisible" @submit="createUser" />
      <AdminUserEditDialog v-model="editDialogVisible" :user="editForm" @save="edit" />
    </div>
  </template>
<script>
import AdminUserCreateDialog from '@/components/admin/AdminUserCreateDialog.vue'
import AdminUserEditDialog from '@/components/admin/AdminUserEditDialog.vue'

export default{
  name: 'AdminUsersPage',
  components: { AdminUserCreateDialog, AdminUserEditDialog },
  data(){
    return{
      queryInfo:{
        query:'',
        pageNo:1,
        pageSize:3
      },
      editForm:{
      },
      userlist:[],
      total:0,
      dialogVisible:false,
      editDialogVisible:false
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    createUser(user) {
        this.axios.post(this.$api.user('/userController/register'),user)
        .then((resp)=>{
          let data=resp.data;
          if(data.code==200){
            this.loginForm={};
            this.dialogVisible= false;
            this.$message({
              message:'注册成功',
              type:'success'
            })
          }else{
            this.$message({
              message:data.message+'或已注册成功',
              type:'error'
            })
          }

        });

      },
    getUserList(){
      this.axios.post(this.$api.user('/userController/selectAll'),
        this.queryInfo
      )
        .then((resp)=>{
          let data=resp.data;
          if(data.code==200){
            this.loginForm={};
            // console.log(data);
            // console.log(data.data);
            // const res=data.data;
            this.userlist=data.data.records;
            this.total=data.data.total;
            console.log(data.data.records);
            // console.log(res);
          }else{
            return this.$message.error('获取用户列表失败')
          }

        });
      
    },
    handleSizeChange(newSize){
      this.queryInfo.pageSize=newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage){
        this.queryInfo.pageNo=newPage;
        this.getUserList();
    },
    showEditDialog(id){
      this.axios.get(this.$api.user('/userController/getUserById/'+id))
      .then((resp)=>{
          let data=resp.data;
          console.log(data);
          if(data.code==200){
            this.editForm=data.data;
          }else{
            return this.$message.error('获取用户列表失败')
          }
        })
      this.editDialogVisible=true;
    },
    touserhome(id){
      let url='/userhome/'+id
      let routeData = this.$router.resolve({ 
        path: url
      });
      //必要操作，否则不会打开新页面
      window.open(routeData.href, '_blank'); 
    },
    edit(){
      this.axios.post(this.$api.user('/userController/addOrUpdateUser'),this.editForm)
        .then((resp)=>{
          let data=resp.data;
          if(data.code==200){
            this.editForm={};
            this.getUserList();
            this.editDialogVisible= false;
            this.$message({
              message:'修改成功',
              type:'success'
            })
          }else{
            this.$message({
              message:'修改失败',
              type:'error'
            })
          }
        })
    },
    async removeUserById(id){
      console.log(id);
      const result=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err=>err)
      if(result!=='confirm'){
        return this.$message.info('取消删除')
      }
      this.axios.get(this.$api.user('/userController/delStudentById/'+id))
      .then((resp)=>{
          let data=resp.data;
          console.log(data);
          if(data.code==200){
            this.getUserList();
            return this.$message.success('删除成功')
          }else{
            return this.$message.error('删除失败')
          }
        })

    }
  }
}
</script>
<style>
.el-scrollbar__wrap {
   overflow-x: hidden; 
}
</style>
