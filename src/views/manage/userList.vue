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
      <!-- 添加用户 -->
      <el-dialog
        title="添加用户"
        v-model="dialogVisible"
        append-to-body
        width="30%"
        @close="handleClose">
        <span>添加用户</span>
         
            <el-form :model="ruleForm" 
            status-icon :rules="rules" 
            ref="ruleForm" 
            label-width="0px" 
            label-position="left"
            class="register-container">
              <el-form-item label="" prop="userId">
                <el-input v-model.number="ruleForm.userId" autocomplete="off" placeholder="请设置8-9位数账号"></el-input>
              </el-form-item>

              <el-form-item label="" prop="username">
                <el-input type="text" v-model="ruleForm.username" autocomplete="off" placeholder="请设置昵称"></el-input>
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="请设置密码"></el-input>
              </el-form-item>
              <el-form-item label="" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="请再次输入密码"></el-input>
              </el-form-item>
            
            </el-form>
  
        <template #footer><span class="dialog-footer">
          <el-button type="primary" @click="submitForm(ruleForm)">注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span></template>
      </el-dialog>
      <!-- 修改用户 -->
      <el-dialog
        title="修改用户信息"
        v-model="editDialogVisible"
        append-to-body
        width="40%">

        <el-form ref="editFormref" :model="editForm" label-width="80px">
          <el-form-item label="用户账号">
            <el-input v-model="editForm.userId" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称">
            <el-input v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用户类型">
            <span>  普通用户  </span><el-switch
              v-model="editForm.usertype"
              active-color="#13ce66"
              inactive-color="#409EFF">
            </el-switch><span>  管理员  </span>
          </el-form-item>
          
        </el-form>

        <template #footer><span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edit">确 定</el-button>
        </span></template>
      </el-dialog>
    </div>
  </template>
<script>

export default{
  data(){
    var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else { 
             if(value<1||value>999999999){
              callback(new Error('必须为8-9个数字'));
             }else{
              callback();
             }                 
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return{
      ruleForm: {
          userId:'',
          username: '',
          password: '',
          checkPass: ''
        },
        rules: {
          userId:[
            { validator: checkAge, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        resetForm(formName) {
        this.$refs[formName].resetFields();
        },
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
    submitForm(ruleForm) {
        this.axios.post(this.$api.user('/userController/register'),this.ruleForm)
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
    handleClose(){
      this.$refs.ruleForm.resetFields();
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
