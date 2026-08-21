<template>
  <div class="about">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ name: 'admin-dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理列表</el-breadcrumb-item>
      <el-breadcrumb-item>推文管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getArticleList">
            <template #append><el-button @click="getArticleList">搜索</el-button></template>
          </el-input>
        </el-col>
      </el-row>

      <!-- 文章列表 -->
      <div style="height: 400px; margin-top: 15px" class="scrollbar">
        <el-scrollbar style="height: 100%">
          <el-table :data="articlelist" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="文章id" prop="articleId"></el-table-column>
            <el-table-column label="文章题目" prop="title">
              <template #default="scope">
                <div>{{ scope.row.title }}</div>
              </template>
            </el-table-column>
            <el-table-column label="文章内容" prop="content" show-overflow-tooltip>
              <template #default="scope">
                <div>{{ scope.row.content }}</div>
              </template>
            </el-table-column>
            <el-table-column label="作者" prop="username"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-tooltip class="item" effect="dark" content="文章详情" placement="top" :enterable="false">
                  <el-button type="warning" @click="toarticlehome(scope.row.articleId)">
                    <el-icon>
                      <SearchIcon />
                    </el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除文章" placement="top" :enterable="false">
                  <el-button type="danger" @click="removeArticelById(scope.row.articleId)">
                    <el-icon>
                      <DeleteIcon />
                    </el-icon>
                  </el-button>
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
        :total="total"></el-pagination>
    </el-card>
    <!-- <el-dialog
        title="文章详情"
        v-model="DialogVisible"
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

        <template #footer><span class="dialog-footer">
          <el-button @click="DialogVisible = false">确定</el-button>
        </span></template>
      </el-dialog> -->
  </div>
</template>
<script>
import { normalizePage } from "@/services/response";

export default {
  name: "AdminArticlesPage",
  data() {
    return {
      queryInfo: {
        query: "",
        pageNo: 1,
        pageSize: 3,
      },
      articlelist: [],
      total: 0,
      // DialogVisible:false,
      // articleDetail:{
      //   userId:0,
      //   userName:"",
      //   articleId:"",
      //   title:"",
      //   content:"",
      // }
    };
  },
  created() {
    this.getArticleList();
  },
  methods: {
    getArticleList() {
      this.$api.articles.search(this.queryInfo).then((resp) => {
        let data = resp.data;
        if (data.success) {
          this.loginForm = {};
          const page = normalizePage(data.data);
          this.total = page.total;
          this.articlelist = page.items;
        } else {
          return this.$message.error("获取文章列表失败");
        }
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getArticleList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNo = newPage;
      this.getArticleList();
    },
    toarticlehome(id) {
      let url = "/articles/" + id;
      let routeData = this.$router.resolve({
        path: url,
      });
      //必要操作，否则不会打开新页面
      window.open(routeData.href, "_blank");
    },
    async removeArticelById(id) {
      const result = await this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (result !== "confirm") {
        return this.$message.info("取消删除");
      }
      this.$api.articles.remove(id).then((resp) => {
        let data = resp.data;
        if (data.success) {
          this.getArticleList();
          return this.$message.success("删除成功");
        } else {
          return this.$message.error("删除失败");
        }
      });
    },
    // showArticleDialog(articleId,userid,title,content){
    //   this.articleDetail.articleId=articleId;
    //   this.articleDetail.content=content;
    //   this.articleDetail.title=title;
    //   this.articleDetail.userId=userid
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
  },
};
</script>
<style>
.el-tooltip__popper {
  max-width: 30%;
}
</style>
