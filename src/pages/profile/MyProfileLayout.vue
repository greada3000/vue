<template>
  <div class="inner-page">
    <SiteHeader @search="search" />
    <main class="page-shell">
      <section class="profile-hero">
        <div class="profile-identity">
          <span class="avatar">{{ avatarText }}</span>
          <div>
            <h1>{{ username }}</h1>
            <p>认真生活，也认真记录每一次成长。</p>
          </div>
        </div>
        <div>
          <el-button v-if="user.usertype" @click="$router.push({ name: 'admin-dashboard' })">管理后台</el-button>
          <el-button
            type="primary"
            @click="
              $router.push({
                name: 'my-articles',
                params: { id: $route.params.id },
              })
            ">
            查看我的文章
          </el-button>
        </div>
      </section>
      <el-menu class="section-menu" mode="horizontal" :default-active="$route.name" router>
        <el-menu-item index="my-profile" :route="{ name: 'my-profile', params: { id: $route.params.id } }">
          主页
        </el-menu-item>
        <el-menu-item index="my-articles" :route="{ name: 'my-articles', params: { id: $route.params.id } }">
          我的文章
        </el-menu-item>
        <el-menu-item index="my-circles" :route="{ name: 'my-circles', params: { id: $route.params.id } }">
          我的圈子
        </el-menu-item>
        <el-menu-item index="my-following" :route="{ name: 'my-following', params: { id: $route.params.id } }">
          关注
        </el-menu-item>
        <el-menu-item index="my-followers" :route="{ name: 'my-followers', params: { id: $route.params.id } }">
          粉丝
        </el-menu-item>
        <el-menu-item
          index="profile-settings"
          :route="{
            name: 'profile-settings',
            params: { id: $route.params.id },
          }">
          资料设置
        </el-menu-item>
        <el-menu-item
          index="change-password"
          :route="{
            name: 'change-password',
            params: { id: $route.params.id },
          }">
          账号安全
        </el-menu-item>
      </el-menu>
      <router-view />
    </main>
  </div>
</template>
<script>
import SiteHeader from "@/components/common/SiteHeader.vue";
export default {
  name: "MyProfileLayout",
  components: { SiteHeader },
  computed: {
    user() {
      return this.$store.getters.getUser || {};
    },
    username() {
      return this.user.username || "社区成员";
    },
    avatarText() {
      return this.username.slice(0, 1);
    },
  },
  methods: {
    search(keyword) {
      this.$router.push({ name: "search-articles", query: { keyword } });
    },
  },
};
</script>
