<template>
    <div id="poster">

      <h3>管理界面主页</h3>
      <el-row>
      <el-button>默认按钮</el-button>
      <el-button type="primary">我的主页</el-button>
      <el-button type="success"  @click="tomyhome">他人主页</el-button>
      <el-button type="info">圈子详情</el-button>
      <el-button type="warning">文章详情</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
    </div>
</template>

<script>
export default {
    name: 'AdminDashboardPage',

    data(){
      return{
        
      }

    },
    methods: {
      tomyhome(){
          let url='/profile/'+this.$store.getters.getUser.name
          this.$router.push({
            path:url
        });

    }

}
}

</script>

<style>
#poster{
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
  margin: 0px;
  padding: 0px;
}</style>
