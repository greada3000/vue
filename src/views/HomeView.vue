<template>
  <body>
   <el-container>
    <el-header style="background-color: aquamarine;">
        <el-row :gutter="20">
          <el-col class="left-entry" :span="6"><div class="grid-content bg-purple">
            <span>home界面</span>
          </div></el-col>

          <el-col class="center-search" :span="12">
            <div class="grid-content bg-purple">
              <el-input v-model="keyword" placeholder="请输入内容"  class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>

            </div>
          </el-col>
         
            <el-col class="right-entry" :span="2">
                <div class="grid-content bg-purple">
                    <span><router-link target="_blank" :to="'/myhome/'+$store.getters.getUser.name">{{$store.getters.getUser.username}}</router-link></span>
                </div>
                        
            </el-col>
          <el-col class="right-entry" :span="5"><div class="grid-content bg-purple">
            <el-button type="primary"  @click="tomymanage" v-if="$store.getters.getUser.usertype">管理主页</el-button>
            <el-button type="danger"  @click="LoginOut" v-if="$store.getters.getLoginStatus">退出</el-button>
            <el-button type="primary"  @click="toLogin" v-else>登录/注册</el-button>
          </div></el-col>
        </el-row>
      </el-header>
    

      <el-main>
        <el-card>
            <div class="card-container">
            <el-card style="width: 80%;">

              <el-row>
                <el-col :span="12" class="word"><router-link target="_blank" :to="'/circle/'+words[0].circleId ">{{ words[0].circleName }}</router-link></el-col>
                <el-col :span="12" class="word"><router-link target="_blank" :to="'/circle/'+words[1].circleId ">{{ words[1].circleName }}</router-link></el-col>
                <el-col :span="12" class="word"><router-link target="_blank" :to="'/circle/'+words[2].circleId ">{{ words[2].circleName }}</router-link></el-col>
              </el-row>
              <el-row>
                <el-col :span="12" class="word"><router-link target="_blank" :to="'/circle/'+words[3].circleId ">{{ words[3].circleName }}</router-link></el-col>
                <el-col :span="12" class="word"><router-link target="_blank" :to="'/circle/'+words[4].circleId ">{{ words[4].circleName }}</router-link></el-col>
                <el-col :span="12" class="word"><router-link target="_blank" :to="'/circle/'+words[5].circleId ">{{ words[5].circleName }}</router-link></el-col>
              </el-row>

          </el-card>
          </div>
          <div class="card-container" v-for="(item,i) in ArticleList" :key="i">
            <el-card style="width: 80%;">
              <div slot="header" class="clearfix">
                  <span style="line-height: 36px"><router-link target="_blank" :to="'/articledetail/'+item.article.id "><h4>{{ item.article.title }}</h4></router-link></span>
                  <h5>作者：<router-link target="_blank" :to="'/userhome/'+item.user.userId ">{{item.user.username}}</router-link>
                  | 圈子： <router-link target="_blank" :to="'/circle/'+item.circle.circleId ">{{item.circle.circleName}}</router-link></h5>
              </div>
              <div class="article-content">
                  {{ item.article.content }}
              </div>
              <div slot="footer" class="clearfix">
                  <el-button type="text" class="pull-right">Read More</el-button>
              </div>
            </el-card>
          </div>

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
      </el-main>
    </el-container>
  </body>
  
</template>

<script>
// @ is an alias to /src



export default {
    name: "HomeView",
    data() {
        return {
            formInline: {
                user: "",
            },
            circle:{
              query:'',
              pageNo:0,
              pageSize:6,
            },
            queryInfo:{
              query:'',
              pageNo:1,
              pageSize:3
            },
            words: [],
            ArticleList:[],
            total:0,
            keyword:'',
        };
    },
    created(){
        this.getMainCircle();
        this.getArticleList();
    },
    computed: {
      firstRow() {
        return this.words.slice(0, 3);
      },
      secondRow() {
        return this.words.slice(3);
      }
    },
    methods: {
        toLogin() {
            this.$router.push({ path: "/Login" });
        },
        LoginOut(){
          this.$store.commit('removeUser')
          this.$router.push({path:"/"});
        },
        tomyhome(){
          let url='/myhome/'+this.$store.getters.getUser.name
          this.$router.resolve({
            path:url
        });
        },
        tomymanage(){
          this.$router.push({path:'/Manage'});
        },
        getMainCircle(){
          this.axios.post('http://localhost:8301/circleController/selectAll',this.circle)
          .then((resp)=>{
                let data=resp.data;
                if(data.code==200){
                  console.log(data)
                  console.log(data.data);
                  this.words=data.data.records;
                }
            })
        },
        handleSizeChange(newSize){
          this.queryInfo.pageSize=newSize;
          this.getArticleList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pageNo=newPage;
            this.getArticleList();
        },
        getArticleList(){
          this.axios.post('http://localhost:8201/articleController/searchByContent',
              this.queryInfo
            )
              .then((resp)=>{
                let data=resp.data;
                if(data.code==200){
                  this.loginForm={};
                  console.log(data.data.data);
                  this.total=data.data.totalHit;
                  this.ArticleList=data.data.data;
                }else{
                    return this.$message.error('获取文章列表失败')
                  }
              });
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
    },
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
  .card-container {
  display: flex;
  justify-content: center;
  align-items: center;
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
