<template>
  <div class="inner-page">
    <SiteHeader @search="search" />
    <main class="page-shell">
      <section class="profile-hero">
        <div class="profile-identity">
          <span class="avatar">{{ avatarText }}</span>
          <div>
            <h1>{{ user.username || `用户 ${$route.params.id}` }}</h1>
            <p>在拾光社区分享兴趣、思考与生活片段。</p>
          </div>
        </div>
        <el-button :type="isFollowing ? 'default' : 'primary'" @click="toggleFollow">
          {{ isFollowing ? "已关注" : "+ 关注" }}
        </el-button>
      </section>
      <el-menu class="section-menu" mode="horizontal" :default-active="$route.name" router>
        <el-menu-item index="user-profile" :route="{ name: 'user-profile', params: { id: $route.params.id } }">
          主页
        </el-menu-item>
        <el-menu-item index="user-articles" :route="{ name: 'user-articles', params: { id: $route.params.id } }">
          TA 的文章
        </el-menu-item>
        <el-menu-item index="user-following" :route="{ name: 'user-following', params: { id: $route.params.id } }">
          TA 的关注
        </el-menu-item>
        <el-menu-item index="user-followers" :route="{ name: 'user-followers', params: { id: $route.params.id } }">
          TA 的粉丝
        </el-menu-item>
      </el-menu>
      <router-view />
    </main>
  </div>
</template>
<script>
import SiteHeader from "@/components/common/SiteHeader.vue";
export default {
  name: "PublicProfileLayout",
  components: { SiteHeader },
  data: () => ({ user: {}, isFollowing: false }),
  computed: {
    avatarText() {
      return (this.user.username || "拾").slice(0, 1);
    },
    currentUserId() {
      return this.$store.getters.getUser?.name;
    },
  },
  created() {
    this.loadProfile();
  },
  methods: {
    search(keyword) {
      this.$router.push({ name: "search-articles", query: { keyword } });
    },
    loadProfile() {
      this.$api.users
        .get(this.$route.params.id)
        .then(({ data }) => {
          if (data.success) this.user = data.data;
        })
        .catch(() => {});
      if (this.currentUserId)
        this.$api.follows
          .status(this.currentUserId, this.$route.params.id)
          .then(({ data }) => {
            if (data.success) this.isFollowing = Boolean(data.data);
          })
          .catch(() => {});
    },
    toggleFollow() {
      if (!this.currentUserId) return this.$router.push({ name: "login" });
      const request = this.isFollowing
        ? this.$api.follows.remove(this.currentUserId, this.$route.params.id)
        : this.$api.follows.create(this.currentUserId, this.$route.params.id);
      request.then(() => {
        this.isFollowing = !this.isFollowing;
        this.$message.success(this.isFollowing ? "关注成功" : "已取消关注");
      });
    },
  },
};
</script>
