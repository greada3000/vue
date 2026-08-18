<template>
    <div id="poster">
        <el-container>
            <el-header style="background-color: aquamarine;">
                <el-row :gutter="20">
                <el-col class="left-entry" :span="5">
                    <div class="grid-content bg-purple">
                    <span>搜索主页</span>
                </div></el-col>

                <el-col :span="12">
                    <!-- <div class="grid-content bg-purple">
                    <el-input placeholder="请输入内容"  class="input-with-select">
                        <template #append><el-button>搜索</el-button></template>
                    </el-input>

                    </div> -->
                </el-col>
                
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
            <el-main>
                <el-row :gutter="20">
                <el-col :span="20">
                    <div class="grid-content bg-purple">
                    <el-input v-model="keyword" placeholder="请输入内容"  class="input-with-select">
                        <template #append><el-button @click="search">搜索</el-button></template>
                    </el-input>

                    </div>
                </el-col>
                <el-col></el-col>
                </el-row>
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1"><router-link :to="{path:'/search/article',query:{keyword:keyword}}">文章</router-link></el-menu-item>
                    <el-menu-item index="2"><router-link :to="{path:'/search/circle',query:{keyword:keyword}}">圈子</router-link></el-menu-item>
                    <el-menu-item index="3"><router-link :to="{path:'/search/user',query:{keyword:keyword}}">用户</router-link></el-menu-item>
                    </el-menu>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                activeIndex: '1',
                keyword:'',
                key:''
            };
        },
        created() {
            // 从路由参数中获取搜索关键字，并进行搜索操作
            this.keyword = this.$route.query.keyword
            // this.key=this.keyword
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
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
            search(activeIndex){
                // console.log('点了')
                let url='/search/article'
                // console.log(bus)
                this.$router.replace({
                    query:{keyword:this.keyword}
                });
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
