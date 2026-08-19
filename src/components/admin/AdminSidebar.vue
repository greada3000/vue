<template>
  <aside class="admin-sidebar">
    <router-link class="admin-brand" to="/"><span class="admin-brand__mark"><el-icon><Sunrise /></el-icon></span><span><strong>拾光社区</strong><small>内容管理中心</small></span></router-link>
    <el-menu :default-active="$route.path" router>
      <el-menu-item index="/admin"><el-icon><DataBoard /></el-icon><span>数据概览</span></el-menu-item>
      <el-menu-item index="/admin/users"><el-icon><User /></el-icon><span>用户管理</span></el-menu-item>
      <el-menu-item index="/admin/circles"><el-icon><Connection /></el-icon><span>圈子管理</span></el-menu-item>
      <el-menu-item index="/admin/articles"><el-icon><Document /></el-icon><span>文章管理</span></el-menu-item>
    </el-menu>
    <div class="admin-sidebar__footer"><p>社区管理规范</p><small>保持内容真实、友善、有价值</small></div>
  </aside>
</template>
<script>
import { Connection, DataBoard, Document, Sunrise, User } from '@element-plus/icons-vue'
export default { name: 'AdminSidebar', components: { Connection, DataBoard, Document, Sunrise, User } }
</script>
<style scoped>.admin-sidebar{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;padding:22px 14px;background:#30243a;color:#fff}.admin-brand{display:flex;align-items:center;gap:12px;padding:4px 10px 28px}.admin-brand__mark{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;background:rgba(255,255,255,.1);font-size:24px}.admin-brand span:last-child{display:flex;flex-direction:column}.admin-brand strong{letter-spacing:.08em}.admin-brand small{margin-top:4px;color:rgba(255,255,255,.55);font-size:10px}.el-menu{--el-menu-bg-color:transparent;--el-menu-text-color:rgba(255,255,255,.72);--el-menu-hover-bg-color:rgba(255,255,255,.08);--el-menu-active-color:#fff}.el-menu-item{margin:5px 0;border-radius:12px}.el-menu-item.is-active{background:#7358b7}.admin-sidebar__footer{margin-top:auto;padding:16px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(255,255,255,.05)}.admin-sidebar__footer p{margin:0 0 6px;font-size:13px}.admin-sidebar__footer small{color:rgba(255,255,255,.5);line-height:1.6}</style>
