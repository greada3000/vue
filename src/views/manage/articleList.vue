<template>
  <div class="about">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理列表</el-breadcrumb-item>
      <el-breadcrumb-item>推文管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getArticleList">
              <el-button slot="append" icon="el-icon-search" @click="getArticleList"></el-button>
            </el-input>
          </el-col>
        </el-row>

                  <!-- 文章列表 -->
      <div style="height:400px;margin-top: 15px;" class="scrollbar">
        <el-scrollbar style="height:100%"> 
          <el-table :data="articlelist" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="文章id" prop="article.id"></el-table-column>
            <el-table-column label="文章题目" prop="article.title">
              <template slot-scope="scope">
                  <div v-html='scope.row.article.title'></div>
              </template>
            </el-table-column>
            <el-table-column label="文章内容" prop="article.content" show-overflow-tooltip>
              <template slot-scope="scope">
                  <div v-html='scope.row.article.content'></div>
              </template>
            </el-table-column>
            <el-table-column label="作者" prop="user.username"></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <!-- <el-tooltip class="item" effect="dark" content="文章详情" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-search" 
                  @click="showArticleDialog(scope.row.id,scope.row.userid,scope.row.title,scope.row.content)"></el-button>
                </el-tooltip> -->
                <el-tooltip class="item" effect="dark" content="文章详情" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-search" @click="toarticlehome(scope.row.article.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除文章" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" @click="removeArticelById(scope.row.article.id)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>

          <!-- 分页区域 -->
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
    <!-- <el-dialog
        title="文章详情"
        :visible.sync="DialogVisible"
        append-to-body
        width="40%">

        <el-form ref="editFormref" :model="articleDetail" label-width="80px">
          <el-form-item label="用户账号">
            <el-input v-model="articleDetail.userId" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称">
            <el-input v-model="articleDetail.username"></el-input>
          </el-form-item>
          
          
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="DialogVisible = false">确定</el-button>
        </span>
      </el-dialog> -->
  </div>
</template>
<script>

export default{
data(){
  return{
    queryInfo:{
      query:'',
      pageNo:1,
      pageSize:3
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
methods:{
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
          this.articlelist=data.data.data;
        }else{
            return this.$message.error('获取文章列表失败')
          }
      });
    
    },
    handleSizeChange(newSize){
      this.queryInfo.pageSize=newSize;
      this.getArticleList();
    },
    handleCurrentChange(newPage){
        this.queryInfo.pageNo=newPage;
        this.getArticleList();
    },
    toarticlehome(id){
      let url='/articledetail/'+id
      let routeData = this.$router.resolve({ 
        path: url
      });
      //必要操作，否则不会打开新页面
      window.open(routeData.href, '_blank'); 
    },
    async removeArticelById(id){
      console.log(id);
      const result=await this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err=>err)
      if(result!=='confirm'){
        return this.$message.info('取消删除')
      }
      this.axios.get('http://localhost:8201/articleController/deleteById/'+id)
      .then((resp)=>{
          let data=resp.data;
          console.log(data);
          if(data.code==200){
            this.getArticleList();
            return this.$message.success('删除成功')
          }else{
            return this.$message.error('删除失败')
          }
        })

    },
    // showArticleDialog(articleId,userid,title,content){
    //   this.articleDetail.articleId=articleId;
    //   this.articleDetail.content=content;
    //   this.articleDetail.title=title;
    //   this.articleDetail.userId=userid
    //   this.axios.get('http://localhost:8201/articleController/deleteById/'+userid)
    //   .then((resp)=>{
    //       let data=resp.data;
    //       console.log(data);
    //       if(data.code==200){
    //         this.articleDetail.userName=data.data.username;
    //         this.DialogVisible=true;
    //       }else{
    //         this.articleDetail.userName="用户信息获取失败";
    //         return this.$message.error('用户信息获取失败')
    //       }
    //     })
    //   this.DialogVisible=true;
    // }
}
}

</script>
<style>
.el-tooltip__popper{
max-width:30%
}
</style>