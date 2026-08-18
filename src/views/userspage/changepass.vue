<template>
    <div class="password-change">
      <el-form ref="form" :model="password" :rules="rules" label-width="120px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="password.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="password.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="password.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
    export default {
        data() {
        return {
            password: {
                uid:this.$store.getters.getUser.name,
                oldPassword:'',
                newPassword: '',
                confirmPassword: ''
            },
            
            rules: {
            oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
            newPassword: [
                { required: true, message: '请输入新密码', trigger: 'blur' },
                { min: 2, max: 20, message: '密码长度为2-20个字符', trigger: 'blur' }
            ],
            confirmPassword: [
                { required: true, message: '请确认新密码', trigger: 'blur' },
                { validator: this.validatePassword, trigger: 'blur' }
            ]
            }
        }
        },
        methods: {
        handleSubmit() {
            this.$refs.form.validate(valid => {
            if (valid) {
                this.axios.post(this.$api.user('/userController/changepass'),this.password)
                .then((resp)=>{
                let data=resp.data;
                if(data.code==200){
                this.password={
                    uid:this.$store.getters.getUser.name,
                };
                this.$message({
                message:'密码修改成功',
                type:'success'
                })
            }else{
                this.$message({
                message:'旧密码错误',
                type:'error'
                })
            }
            })
            }
        });
        },
        validatePassword(rule, value, callback) {
            if (!value) {
            callback(new Error('请再次输入新密码'));
            } else if (value !== this.password.newPassword) {
            callback(new Error('两次输入的密码不一致'));
            } else {
            callback();
            }
        }
        }
    }
  </script>
  
  <style>
  .password-change {
    margin: 50px auto;
    width: 400px;
  }
  </style>
  
