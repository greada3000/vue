<template>
  <header class="site-header">
    <div class="site-header__inner">
      <router-link class="brand" to="/" aria-label="拾光社区首页">
        <span class="brand__mark">
          <el-icon>
            <Sunrise />
          </el-icon>
        </span>
        <span class="brand__copy">
          <strong>拾光社区</strong>
          <small>记录热爱 · 连接同好</small>
        </span>
      </router-link>

      <nav class="site-nav" aria-label="主导航">
        <router-link to="/">首页</router-link>
        <router-link :to="{ name: 'search-circles', query: { keyword: '' } }">圈子</router-link>
        <router-link v-if="isLoggedIn" :to="profileRoute">关注</router-link>
      </nav>

      <form class="site-search" @submit.prevent="submitSearch">
        <button class="site-search__submit" type="submit" aria-label="搜索">
          <el-icon>
            <Search />
          </el-icon>
        </button>
        <input v-model="searchValue" placeholder="搜索灵感与同好" aria-label="搜索内容" @keyup.enter="submitSearch" />
      </form>

      <div class="site-actions">
        <el-button class="icon-button" circle aria-label="通知">
          <el-icon>
            <Bell />
          </el-icon>
        </el-button>
        <router-link v-if="isLoggedIn" class="user-chip" :to="profileRoute">
          <span class="avatar">{{ avatarText }}</span>
          <span>{{ username }}</span>
        </router-link>
        <el-button v-else class="login-button" @click="$router.push({ name: 'login' })">登录</el-button>
        <el-button type="primary" class="write-button" @click="handleWrite">
          <el-icon>
            <EditPen />
          </el-icon>
          <span>写文章</span>
        </el-button>
      </div>
    </div>
  </header>
</template>

<script>
import { Bell, EditPen, Search, Sunrise } from "@element-plus/icons-vue";

export default {
  name: "SiteHeader",
  components: { Bell, EditPen, Search, Sunrise },
  props: { keyword: { type: String, default: "" } },
  emits: ["search", "write"],
  data() {
    return { searchValue: this.keyword };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.getLoginStatus;
    },
    user() {
      return this.$store.getters.getUser || {};
    },
    username() {
      return this.user.username || "社区成员";
    },
    avatarText() {
      return this.username.slice(0, 1).toUpperCase();
    },
    profileRoute() {
      return `/profile/${this.user.name || this.user.userId || "me"}`;
    },
  },
  watch: {
    keyword(value) {
      this.searchValue = value || "";
    },
  },
  methods: {
    submitSearch() {
      this.$emit("search", this.searchValue);
      if (!this.$.vnode.props?.onSearch) {
        this.$router.push({ name: "search-articles", query: { keyword: this.searchValue } });
      }
    },
    handleWrite() {
      this.$emit("write");
      if (!this.isLoggedIn) this.$router.push({ name: "login" });
      else if (!this.$.vnode.props?.onWrite) this.$message.info("请先进入一个圈子，再开始创作");
    },
  },
};
</script>
