<template>
  <div class="admin-page"><el-container class="admin-frame"><el-aside width="230px"><AdminSidebar /></el-aside><el-container><el-header class="admin-topbar"><div><h1>{{ pageTitle }}</h1><small>维护一个真实、友善、有活力的社区</small></div><div class="admin-topbar__actions"><el-button text @click="$router.push('/')">返回社区</el-button><span class="avatar">{{ avatarText }}</span><strong>{{ username }}</strong></div></el-header><el-main class="admin-main"><router-view /></el-main></el-container></el-container></div>
</template>
<script>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
export default { name: 'AdminLayout', components: { AdminSidebar }, computed: { username() { return this.$store.getters.getUser?.username || '管理员' }, avatarText() { return this.username.slice(0,1) }, pageTitle() { return { 'admin-dashboard':'数据概览','admin-users':'用户管理','admin-circles':'圈子管理','admin-articles':'文章管理' }[this.$route.name] || '管理后台' } } }
</script>
