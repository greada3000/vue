<template>
    <div class="about">
        <el-scrollbar style="height:75%">
        <!-- <span>wode搜索主页</span> -->
        <!-- <span>{{$route.params.id}}</span> -->
        <el-col :span="15" :offset="2">
            <el-card>
                <div v-for="(item,i) in circlelist" :key="i">
                    <el-card>
                        <template #header><div class="clearfix">
                            <el-row :gutter="6">
                                <el-col :span="7">
                                <h3><router-link target="_blank" :to="'/circle/'+item.circleId ">{{item.circleName}}</router-link></h3>
                                <h5>{{item.detail}}</h5>
                                </el-col>
                            </el-row> 
                        </div></template>
                    </el-card>
                </div>
            </el-card>
        </el-col>
    </el-scrollbar>
    </div>
</template>
<script>
export default{
    name: 'CircleSearchResults',
    data(){
      return{
        queryInfo:{
          query:this.$route.query.keyword,
          pageNo:1,
          pageSize:10
        },
        circlelist:[],
        total:0,
    }
    },
    created(){
        this.getCircleList()
    },
    watch: {
        // 如果 `question` 发生改变，这个函数就会运行
    $route: function (newQuestion, oldQuestion) {
        this.getCircleList({ pageNo:1,query:this.$route.query.keyword,
        pageSize:10})
        }
    },
    methods:{
        getCircleList(keyword = undefined){
        // console.log('1111')
        // console.log('传参',keyword)
        this.axios.post(this.$api.circle('/circleController/selectAll'),
        keyword ?keyword: this.queryInfo
        )
      .then((resp)=>{
        let data=resp.data;
        if(data.code==200){
          this.loginForm={};
          console.log(data.data);
          console.log(data.data.records);
          this.total=data.data.totalHit;
          this.circlelist=data.data.records;
        }else{
            return this.$message.error('获取圈子列表失败')
          }
      });
    
    }
} 

}


</script>
