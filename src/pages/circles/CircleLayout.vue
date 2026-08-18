<template>
    <div>
        <el-container>
            <el-header style="background-color: aquamarine;">
                <el-row :gutter="20">
                <el-col class="left-entry" :span="5">
                    <div class="grid-content bg-purple">
                    <span>{{$route.params.id}}兴趣圈主页</span>
                </div></el-col>

                <el-col class="center-search" :span="12">
                    <div class="grid-content bg-purple">
                    <el-input v-model="keyword" placeholder="请输入内容"  class="input-with-select">
                        <template #append><el-button @click="search">搜索</el-button></template>
                    </el-input>

                    </div></el-col>
                
                    <el-col class="right-entry" :span="2">
                        <div class="grid-content bg-purple">
                            <span><router-link target="_blank" :to="'/myhome/'+$store.getters.getUser.name">{{$store.getters.getUser.username}}</router-link></span>
                        </div>
                        
                    </el-col>
                    <el-col class="right-entry" :span="5">
                    <div class="grid-content bg-purple">
                        <!-- <el-image
                        style="width: 100px; height: 100px"
                        :src="url"
                        :fit="fit"></el-image> -->
                    
                        <el-button type="primary"  @click="toManage" v-if="$store.getters.getUser.usertype">管理主页</el-button>
                        <el-button type="danger"  @click="LoginOut" v-if="$store.getters.getLoginStatus">退出</el-button>
                        <el-button type="primary"  @click="toLogin" v-else>登录/注册</el-button>
                    
                    </div>
                </el-col>
                </el-row>
            </el-header>
            <el-card>
                <el-row :gutter="1">
                    <el-col :span="13">
                        <h3>{{circle.circleName}}</h3>
                        {{ circle.detail }}
                    </el-col>
                    <el-col :span="3">
                      <el-button type="danger"  @click="no" v-if=is>退出</el-button>
                      <el-button type="primary" @click="isconcent" v-else>加入</el-button>
                    </el-col>
                    <el-col :span="10">
                      <el-button type="primary"  @click="toSave">新建文章</el-button>
                    </el-col>
                </el-row>
                
                
            </el-card>
            <el-menu :default-active="activeIndex" 
            class="el-menu-demo" 
            mode="horizontal" 
            @select="handleSelect"
            >
            <el-menu-item index="home"><router-link :to="'/circle/'+$route.params.id">主页</router-link></el-menu-item>
            <el-menu-item index="myarticle"><router-link :to="'/circle/'+$route.params.id+'/article' ">圈子文章</router-link></el-menu-item>
            <!-- <el-menu-item index="mydetail"><router-link :to="'/circle/'+$route.params.id+'/myinfo' ">圈子用户</router-link></el-menu-item> -->
            </el-menu>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>


        <el-dialog
        title="新增文章"
        v-model="editDialogVisible"
        append-to-body
        width="40%">

        <el-form ref="editFormref" :model="article" label-width="80px">
          <el-form-item label="文章标题">
            <el-input v-model="article.title" style="width: 450px;"></el-input>
          </el-form-item>
          <el-form-item label="文章内容">
            <el-input type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="article.content"
            style="width: 450px;">
          </el-input>
          </el-form-item>

          
        </el-form>

        <template #footer><span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span></template>
      </el-dialog>
    </div>
</template>


<script>

export default {
  name: 'CircleLayout',
    data() {
        return{
            activeIndex: 'home',
            keyword:'',
            circle:{},
            user:{},
            is:0,
            editDialogVisible:false,
            article:{
              circle:this.$route.params.id,
              userid:this.$store.getters.getUser.name,
              username:this.$store.getters.getUser.username,
            }
        }
    },
    created(){
        this.getCircle();
        
    },
    methods: {
        toLogin() {
            this.$router.push({ path: "/Login" });
        },
        LoginOut(){
          this.$store.commit('removeUser')
          this.$router.push({path:"/"});
        },
        toManage(){
          this.$router.push({path:"/Manage"});
        },
        handleSelect(key, keyPath) {
        console.log(key, keyPath);
        },
        getCircle(){
            this.axios.post(this.$api.circle('/circleController/circle/'+this.$route.params.id))
            .then((resp)=>{
                let data=resp.data;
                if(data.code==200){
                    console.log(data)
                    console.log(data.data)
                    this.circle=data.data
                    this.getUser()
                }
            })
        },
        getUser(){
            this.axios.post(this.$api.user('/userController/getUserById/'+this.circle.owner))
            .then((resp)=>{
                let data=resp.data;
                if(data.code==200){
                    console.log(data)
                    console.log(data.data)
                    this.user=data.data
                }
            })
        },
        search() {
          // 使用编程式导航跳转到目标路由，并传递搜索关键字作为参数
          // this.$router.push({ name: '/search', query: { keyword: this.keyword }})
          let url='/search/article'
          let routeData = this.$router.resolve({ 
            path: url,
            query: { keyword: this.keyword }
          });
          //必要操作，否则不会打开新页面
          window.open(routeData.href, '_blank'); 
        },
        toSave(){
          this.editDialogVisible=true
        },
        save(){
          this.axios.post(this.$api.article('/articleController/save'),
          this.article
          ) .then((resp)=>{
            let data=resp.data;
            console.log(data);
            this.editDialogVisible=false;
            this.$message({
              message:'新增成功',
              type:'success'
            })
          })
        },
        no(){
          this.is=0
        },
        isconcent(){
          this.is=1
        }
    }
}
</script>

<style lang="less" scoped>
  .el-row {
    display:flex;
    justify-content:center;
    align-items:center;
    margin-bottom: 20px;
    height: 60px;
  }
  .el-col {
    text-align:center;
    border-radius: 4px;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
