<template>
    <div id="poster" class="scrollbar">
        <el-scrollbar style="height:75%">
        <!-- <span>wode搜索主页</span> -->
        <!-- <span>{{$route.params.id}}</span> -->
        <el-col :span="20" :offset="2">
            <el-card v-if="articlelist">
                
                <div v-for="(item,i) in articlelist" :key="i">
                    
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span style="line-height: 36px"><router-link target="_blank" :to="'/articledetail/'+item.article.id "><div v-html="item.article.title"></div></router-link></span>
                            <h5>作者：<router-link target="_blank" :to="'/userhome/'+item.user.userId ">{{item.user.username}}</router-link>
                              | 圈子： <router-link target="_blank" :to="'/circle/'+item.circle.circleId ">{{item.circle.circleName}}</router-link></h5>
                        </div>
                        <div class="article-content">
                            {{ item.article.content }}
                        </div>
                        <!-- <div slot="footer" class="clearfix">
                            <el-button type="text" class="pull-right">Read More</el-button>
                        </div> -->

                    </el-card>
                </div>
            </el-card>
        </el-col>
    </el-scrollbar>
    </div>
</template>

<script>
export default{
data(){
  return{
    queryInfo:{
      query:this.$route.query.keyword,
      pageNo:1,
      pageSize:10
    },
    articlelist:[],
    total:0,
    // DialogVisible:false,
    // articleDetail:{
    //   userId:0,
    //   userName:"",
    //   articleId:"",
    //   title:"",
    //   content:"",
    // }
  }
},
created(){
  this.getArticleList()
},
mounted(){
  // bus.$on('search',()=>console.log('cs 锁我'))
},
watch: {
    // 如果 `question` 发生改变，这个函数就会运行
   $route: function (newQuestion, oldQuestion) {
      this.getArticleList({ pageNo:1,query:this.$route.query.keyword,
      pageSize:10})
    }
  },
methods:{
  getArticleList(keyword = undefined){
    console.log('1111')
    console.log('传参',keyword)
    this.axios.post('http://localhost:8201/articleController/searchByContent',
      keyword ?keyword: this.queryInfo
    )
      .then((resp)=>{
        let data=resp.data;
        if(data.code==200){
          this.loginForm={};
          console.log(data.data.data);
          this.total=data.data.totalHit;
          this.articlelist=data.data.data;
        }else{
            return this.$message.error('获取文章列表失败')
          }
      });
    
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
