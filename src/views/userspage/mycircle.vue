<template>
    <div class="about">
        <el-scrollbar style="height:75%">
        <!-- <span>wode搜索主页</span> -->
        <!-- <span>{{$route.params.id}}</span> -->
        <el-col :span="15" :offset="2">
            <el-card>
                <div v-for="(item,i) in circlelist" :key="i">
                    <el-card>
                        <div slot="header" class="clearfix">
                            <el-row :gutter="6">
                                <el-col :span="7">
                                <h3><router-link target="_blank" :to="'/circle/'+item.circleId ">{{item.circleName}}</router-link></h3>
                                <h5>{{item.detail}}</h5>
                                </el-col>
                                <el-col :span="3">
                                    <el-button type="danger" @click="mydelete(item.circleId)">删除</el-button>
                                </el-col>
                            </el-row> 
                        </div> 
                    </el-card>
                </div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <div style="margin: 10px;">
                <el-button type="primary" @click="editDialogVisible=true">新建圈子</el-button>
            </div>
            
        </el-col>
    </el-scrollbar>
    <el-dialog
        title="新建圈子"
        :visible.sync="editDialogVisible"
        append-to-body
        width="40%">

        <el-form :model="editForm" label-width="80px">
          <el-form-item label="圈子名">
            <el-input v-model="editForm.circleName"></el-input>
          </el-form-item>
          <el-form-item label="圈子简介">
            <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="editForm.detail"
            maxlength="30"
            style="width: 440px;"
            show-word-limit>
            </el-input>
          </el-form-item>

          
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
 <script>
  export default{
      data() {
          return {
            circlelist:[],
            editForm:{
                owner:this.$store.getters.getUser.name
            },
            editDialogVisible:false
          }
      },
      created(){
        this.getcirclelist()
      },
      methods:{
        getcirclelist(){
            this.axios.post('http://localhost:8301/circleController/ownercircle/'+this.$route.params.id)
            .then((resp)=>{
                let data=resp.data;
                console.log(data.data)
                this.circlelist=data.data
            })
        },
        mydelete(id){
            this.axios.post('http://localhost:8301/circleController/delete/'+id)
            .then((resp)=>{
                let data=resp.data;
                console.log(data.data)
                this.getcirclelist()
            })
        },
        edit(){
            this.axios.post('http://localhost:8301/circleController/addcircle',this.editForm)
            .then((resp)=>{
                let data=resp.data;
                if(data.code==200){
                    console.log(data.data)
                    this.editForm={};
                    this.editDialogVisible= false;
                    this.$message({
                    message:'新增成功',
                    type:'success'
                })
                this.getcirclelist()
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
 .article-content {
   /* 其他样式 */
   /* 限制文章内容宽度为一行 */
   display: -webkit-box;
   -webkit-line-clamp: 2;
   -webkit-box-orient: vertical;
   overflow: hidden;
   width: 100%;
 }
 </style>

