<template>
  <div class="about">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理列表</el-breadcrumb-item>
      <el-breadcrumb-item>圈子管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
              <template #append><el-button @click="getUserList">搜索</el-button></template>
            </el-input></el-col>
        </el-row>

         <!-- 用户列表 -->
      <div style="height:400px;margin-top: 15px;" class="scrollbar">
        <el-scrollbar style="height:100%"> 
          <el-table :data="circlelist" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="圈子名称" prop="circleName"></el-table-column>
            <el-table-column label="圈子ID" prop="circleId"></el-table-column>
            <el-table-column label="圈子简介" prop="detail"></el-table-column>
            <el-table-column label="作者ID" prop="owner"></el-table-column>
            <el-table-column label="操作" >
              <template #default="scope">
                <el-tooltip class="item" effect="dark" content="修改用户" placement="top" :enterable="false">
                  <el-button type="primary" @click="showEditDialog(scope.row.circleId)"><el-icon><EditIcon /></el-icon></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="圈子主页" placement="top" :enterable="false">
                  <el-button type="warning" @click="tocirclehome(scope.row.circleId)"><el-icon><SearchIcon /></el-icon></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除圈子" placement="top" :enterable="false">
                  <el-button type="danger" @click="removeUserById(scope.row.circleId)"><el-icon><DeleteIcon /></el-icon></el-button>
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
    circlelist:[],
    total:0,
  }
},
created(){
  this.getUserList()
},
// 兴趣圈管理页面
methods:{
  getUserList(){
    this.axios.post(this.$api.circle('/circleController/selectAll'),
      this.queryInfo
    )
      .then((resp)=>{
        let data=resp.data;
        if(data.code==200){
          this.loginForm={};
          console.log(data);
          console.log(data.data);
          console.log(data.data.records)
          this.circlelist=data.data.records;
          this.total=data.data.total;
        }

      });
    
  },
  handleSizeChange(newSize){
      this.queryInfo.pageSize=newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage){
        this.queryInfo.pageNo=newPage;
        this.getUserList();
    },
    tocirclehome(id){
      let url='/circle/'+id
      let routeData = this.$router.resolve({ 
        path: url
      });
      //必要操作，否则不会打开新页面
      window.open(routeData.href, '_blank'); 
    },
    async removeUserById(id){
      console.log(id);
      const result=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err=>err)
      if(result!=='confirm'){
        return this.$message.info('取消删除')
      }
      this.axios.get(this.$api.user('/userController/delStudentById/'+id))
      .then((resp)=>{
          let data=resp.data;
          console.log(data);
          if(data.code==200){
            this.getUserList();
            return this.$message.success('删除成功')
          }else{
            return this.$message.error('删除失败')
          }
        })

    }
}
}

</script>

