<template>
    <div id="poster">
        <!-- <span>{{$route.params.id}}</span> -->
        <div class="user-info">
        <el-card class="user-card">
        <div slot="header" class="user-card-header">
            <span class="user-card-title">信息修改</span>
        </div>
        <el-form class="user-form" :model="user">
            <el-form-item label="昵称">
            <el-input v-model="user.username"></el-input>
            </el-form-item>
            <!-- <el-form-item label="圈子简介">
            <el-input v-model="user.email"></el-input>
            </el-form-item> -->
        </el-form>
        <el-form>
          <el-button type="primary" @click="search">确认</el-button>
          <!-- <el-button>重置</el-button> -->
        </el-form>
        </el-card>
  </div>
    </div>
</template>

<script>
    export default {
    data() {
        return {
        user: {
            username:this.$store.getters.getUser.username,
            usertype:this.$store.getters.getUser.usertype
        }
        }
    },
    created(){
      this.getUser()
    },
    methods:{
      getUser(){
        this.axios.post('http://localhost:8101/userController/getUserById/'+this.$route.params.id)
        .then((resp)=>{
          let data=resp.data;
          if(data.code==200){
            this.name=data.data.username
            console.log(data.data.username)
          }
        })
      },
      search(){
        this.axios.post('http://localhost:8101/userController/addOrUpdateUser',this.editForm)
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
      }
    }
    }
</script>

<style>
.user-card {
  width: 400px;
  margin: 50px auto;
}
.user-card-header {
  text-align: center;
}
.user-card-title {
  font-size: 20px;
  font-weight: bold;
}
.user-form {
  margin-top: 20px;
}
</style>







