   <template>
    <el-container>
     <el-header style="background-color: aquamarine;">
        <el-row :gutter="20">
        <el-col class="left-entry" :span="5">
            <div class="grid-content bg-purple">
            <span>我的主页</span>
        </div></el-col>

        <el-col class="center-search" :span="12">
            <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容"  class="input-with-select">
                <template #append><el-button>搜索</el-button></template>
            </el-input>

            </div></el-col>
        
            <el-col class="right-entry" :span="2">
                <div class="grid-content bg-purple">
                    <span><router-link target="_blank" :to="'/myhome/'+$store.getters.getUser.username">{{$store.getters.getUser.username}}</router-link></span>
                </div>
                
            </el-col>
            <el-col class="right-entry" :span="5">
            <div class="grid-content bg-purple">        
                <el-button type="primary"  @click="toManage" v-if="$store.getters.getUser.usertype">管理主页</el-button>
                <el-button type="danger"  @click="LoginOut" v-if="$store.getters.getLoginStatus">退出</el-button>
                <el-button type="primary"  @click="toLogin" v-else>登录/注册</el-button>
            </div>
        </el-col>
        </el-row>
    </el-header>

    <el-main>
    
        <el-col :span="20" :offset="2">
        <el-card>
            <h3>{{article.title}}</h3>
            <el-divider></el-divider>
            <h5>作者：<router-link target="_blank" :to="'/userhome/'+user.userId ">{{user.username}}</router-link>
               | 圈子： <router-link target="_blank" :to="'/circle/'+circle.circleId ">{{circle.circleName}}</router-link></h5>
            <el-divider></el-divider>
            {{article.content}}
            
            <el-divider></el-divider>
            <span><h3>评论</h3></span>
            <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="review.content"
            maxlength="30"
            style="width: 500px;"
            show-word-limit>
            </el-input>
            <el-button type="primary" style="margin-left: 20px;" @click="makeReivew">发表评论</el-button>
            <el-divider></el-divider>

            <!-- 评论区 -->
            <div v-for="(item,i) in reviewlist" :key="i" class="author-title reply-father">
                <el-card>
                    <div class="author-info">
                    <router-link target="_blank" :to="'/userhome/'+item.user.userId "><span class="author-name">{{item.user.username}}:</span></router-link>

                    </div>
                    <div class="talk-box">
                    <p>
                        <span class="reply">{{item.content}}</span>
                    </p>
                    </div>
                </el-card>

            </div>
            


        </el-card>     
        </el-col>
    
    </el-main>
  
</el-container>    
</template>



<script>

export default {
  name: 'ArticleDetailPage',
    data() {
        return{
            article:{

            },
            user:{

            },
            circle:{

            },
            reviewlist:[],
            review:{
                ownerId:this.$store.getters.getUser.name,
                articleId:this.$route.params.aid,
                content: ''
            }
            
        }
    },
    created(){
        this.axios.get(this.$api.article('/articleController/searchById/'+this.$route.params.aid))
      .then((resp)=>{
        let data=resp.data;
        console.log(data);
        console.log(data.data);
        this.article=data.data.article;
        this.user=data.data.user;
        this.circle=data.data.circle;
      }),
      this.getReviewList()
      
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
        getReviewList(){
            this.axios.post(this.$api.review('/reviewController/searchReviewById/'+this.$route.params.aid))
            .then((resp)=>{
            let data=resp.data;
            if(data.code==200){
                this.reviewlist=data.data;
                console.log(this.reviewlist);

            }
        }
        )},
        makeReivew(){
            if(this.review.content==''){
                return
            }
            this.axios.post(this.$api.review('/reviewController/addOrUpdateReview'),this.review)
            .then((resp)=>{
            let data=resp.data;
            if (data.code==200) {
                this.$message({
                message:'评论成功',
                type:'success',
            });
            this.getReviewList();
            }
        })
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
  
//   .head {
//     text-align:center;
//     border-radius: 4px;
//   }
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
