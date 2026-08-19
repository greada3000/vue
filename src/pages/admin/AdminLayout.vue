<template>
	<body id="poster">
		<el-container>
			<el-aside width="200px">
				<AdminSidebar />
			</el-aside>
			<el-container>
				<el-header style="background-color: antiquewhite;">
				
				<span><router-link target="_blank" :to="'/profile/'+$store.getters.getUser.name">{{ $store.getters.getUser.username }}</router-link></span>
				
				
				</el-header>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>

	</body>
</template>

<script>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
export default {
  name: 'AdminLayout',
		components:{
			AdminSidebar
		}
    }
</script>

<style>



</style>
