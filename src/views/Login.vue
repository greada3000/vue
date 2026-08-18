<template>
    <body id="poster">     
        <el-form class="login-container" label-position="left" label-width="0px">
          <div>
            <h1 class="login_title">登录界面</h1>
          </div>

          <el-form-item label="">
            <el-input v-model.number="loginForm.userId" autocomplete="off" placeholder="账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="密码" show-password></el-input>
          </el-form-item>
          <el-form-item style="width:100%;">
            <el-button type="primary" style="width: 100%;" @click="Login">登录</el-button>
          </el-form-item>
          <el-button type="text" @click="toRegister">点击去注册</el-button>
        </el-form>
    </body>
    
  </template>
  
  <script>
  
  export default {
    name: 'Login',  
    data() {
      return {
        loginForm: {
          userId: '',
          password: '',
        }
      }
    },
    methods: {
      Login(loginForm) {
        this.axios.post(this.$api.user('/userController/login'),this.loginForm)
        .then((resp)=>{
          let data=resp.data;
          console.log(data);
          if (data.code==200) {
            this.$store.dispatch('asyncUpdateUser',{name:data.data.userId,username:data.data.username,usertype:data.data.usertype,pic:data.data.userpic})
            this.loginForm={};
            this.$message({
              message:'登陆成功',
              type:'success'
            })
            if(data.data.usertype){
              this.$router.push({path:'/Manage'});
            }else{
              this.$router.push({path:'/'});
            }
            
          } else {
            this.$message({
              message:data.message,
              type:'error'
            })
            // console.log('submit!',this.loginForm);
            // console.log('submit!',data);
          }
        });
        

        // this.$router.push({path:'/Manage'});
      },
      toRegister(){
        this.$router.push({path:'/Register'});
      }
    }
  }
  </script>

<style>
  #poster{
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body{
    margin: 0px;
    padding: 0px;
  }
  .login-container{
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    text-align: center;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
</style>
