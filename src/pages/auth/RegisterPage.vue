<template>
  <div id="poster">   
    <el-form :model="ruleForm" 
    status-icon :rules="rules" 
    ref="ruleForm" 
    label-width="0px" 
    label-position="left"
    class="register-container">
      <h3>注册页面</h3>
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
      
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleForm)">注册</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
      <el-button type="text" @click="toLogin">点击去登录</el-button>
    </el-form>
  </div>
  </template>
  
  <script>

export default {
  name: 'RegisterPage',
    name: 'Register',
    data() {
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
      return {
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
        }
      };
    },
    methods: {
      submitForm(ruleForm) {
        this.$api.users.create(this.ruleForm)
        .then((resp)=>{
          let data=resp.data;
          if(data.success){
            this.loginForm={};
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      toLogin(){
        this.$router.push({name:'login'});
      }
    }
  }
  </script>

<style lang="less" scoped>
#poster{
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
  margin: 0px;
  padding: 0px;
}

.register-container{
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
