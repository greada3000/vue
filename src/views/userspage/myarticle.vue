<template>
    <div id="poster" class="scrollbar">
        <el-scrollbar style="height:75%">
        <!-- <span>wode搜索主页</span> -->
        <!-- <span>{{$route.params.id}}</span> -->
        <el-col :span="20" :offset="2">
            <el-card>
                
                <div v-for="(item,i) in articlelist" :key="i">
                    
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span style="line-height: 36px"><router-link target="_blank" :to="'/articledetail/'+item.article.id "><h4>{{ item.article.title }}</h4></router-link></span>
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

    <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNo"
            :page-sizes="[3, 4, 5, 10]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination> -->
    </div>
</template>



<script>
export default{
    data() {
        return {
            articlelist:[],
            total:0
        }
    },
    created(){
        this.getMyArticle();
    },
    methods:{
        getMyArticle(){
            this.axios.post('http://localhost:8201/articleController/searchByUserId/'+this.$route.params.id)
            .then((resp)=>{
                let data=resp.data;
                if(data.code==200){
                    console.log(data)
                    console.log(data.data)
                    this.total=data.data.totalHit
                    this.articlelist=data.data.data
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