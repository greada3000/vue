<template>
    <el-menu default-active="defaultActive" 
            class="el-menu-vertical-demo" 
            @open="handleOpen" 
            @close="handleClose" 
            :collapse="isCollapse" 
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router>
        <h3>管理系统</h3>
      <el-menu-item index="manage">
        首页
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <span>管理列表</span>
        </template>
          <el-menu-item index="userList">用户管理</el-menu-item>
          <el-menu-item index="adminList">圈子管理</el-menu-item>
          <el-menu-item index="articleList">推文管理</el-menu-item>
    </el-sub-menu>
    </el-menu>
</template>

<script>
  export default {
    data() {
      return {
        isCollapse: false
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
		},
  }
</script>

<style lang="less" scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-menu{
    height: 100vh;
    h3{
      color: #fff;
      text-align: center;
      line-height: 48px;
    }
  }
</style>
