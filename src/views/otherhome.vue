<template>
    <div>
        <el-container>
            <el-header style="background-color: aquamarine;">
                <el-row :gutter="20">
                <el-col class="left-entry" :span="5">
                    <div class="grid-content bg-purple">
                    <span>他人主页</span>
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
                    <el-col :span="2">
                        <h3>{{ user.username }}</h3>
                    </el-col>
                    <el-col :span="3">
                      <el-button type="danger"  @click="quxiaoguanzhu" v-if=is>取消关注</el-button>
                        <el-button type="primary" @click="guanzhu" v-else>关注</el-button>
                    </el-col>
                    <el-col :span="18">
                    </el-col>
                </el-row>
                
                
            </el-card>
            
            <el-menu :default-active="activeIndex" 
            class="el-menu-demo" 
            mode="horizontal" 
            @select="handleSelect"
            >
            <el-menu-item index="home"><router-link :to="'/userhome/'+$route.params.id">主页</router-link></el-menu-item>
            <el-menu-item index="myarticle"><router-link :to="'/userhome/'+$route.params.id+'/hisarticle' ">TA的文章</router-link></el-menu-item>
            <el-menu-item index="mydetail"><router-link :to="'/userhome/'+$route.params.id+'/hisconcern' ">TA的关注</router-link></el-menu-item>
            <el-menu-item index="myfans"><router-link :to="'/userhome/'+$route.params.id+'/hisfans' ">TA的粉丝</router-link></el-menu-item>
          </el-menu>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>


<script>

export default {
    data() {
        return{
            activeIndex: 'home',
            keyword:'',
            is:0,
            user:{},
            prelast:{
              preuser:this.$store.getters.getUser.name,
              lastuser:this.$route.params.id,
            }
        }
    },
    created(){
        this.getUser();
        this.getconcern();
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
        getUser(){
            this.axios.post(this.$api.user('/userController/getUserById/'+this.$route.params.id))
            .then((resp)=>{
                let data=resp.data;
                if(data.code==200){
                    console.log(data)
                    console.log(data.data)
                    this.user=data.data
                }
            })
        },
        getconcern(){
          this.axios.post(this.$api.relation('/userConController/getconcern'),this.prelast)
            .then((resp)=>{
              let data=resp.data;
              if(data.code==200){
                    this.is=data.data
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
        guanzhu(){
          this.axios.post(this.$api.relation('/userConController/addOrUpdate'),this.prelast)
            .then((resp)=>{
              let data=resp.data;
              if(data.code==200){
                  console.log(data)
              }
            })
            this.is=1
        },
        quxiaoguanzhu(){
          this.axios.post(this.$api.relation('/userConController/deleteCon'),this.prelast)
            .then((resp)=>{
              let data=resp.data;
              if(data.code==200){
                console.log(data)
              }
            })
          this.is=0
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
