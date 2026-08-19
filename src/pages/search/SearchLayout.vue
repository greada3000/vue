<template>
  <div class="inner-page">
    <SiteHeader :keyword="keyword" @search="search" />
    <main class="page-shell search-page">
      <div class="page-heading">
        <h1>搜索社区</h1>
        <p>找到与你兴趣相投的文章、圈子和创作者。</p>
      </div>
      <form class="search-hero" @submit.prevent="search(keyword)">
        <el-input v-model="keyword" size="large" clearable placeholder="输入关键词">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button type="primary" size="large" native-type="submit">搜索</el-button>
      </form>
      <el-menu class="section-menu" mode="horizontal" :default-active="$route.name" router>
        <el-menu-item index="search-articles" :route="{ name: 'search-articles', query: { keyword } }">
          文章
        </el-menu-item>
        <el-menu-item index="search-circles" :route="{ name: 'search-circles', query: { keyword } }">圈子</el-menu-item>
        <el-menu-item index="search-users" :route="{ name: 'search-users', query: { keyword } }">用户</el-menu-item>
      </el-menu>
      <router-view :key="$route.fullPath" />
    </main>
  </div>
</template>
<script>
import { Search } from "@element-plus/icons-vue";
import SiteHeader from "@/components/common/SiteHeader.vue";
export default {
  name: "SearchLayout",
  components: { Search, SiteHeader },
  data() {
    return { keyword: this.$route.query.keyword || "" };
  },
  watch: {
    "$route.query.keyword"(value) {
      this.keyword = value || "";
    },
  },
  methods: {
    search(keyword) {
      this.$router.push({
        name: "search-articles",
        query: { keyword: keyword || "" },
      });
    },
  },
};
</script>
<style scoped>
.search-page {
  max-width: 1120px;
}

.search-hero {
  display: flex;
  gap: 12px;
  padding: 18px;
  margin-bottom: 18px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
}

.search-hero .el-input {
  flex: 1;
}

@media (max-width: 560px) {
  .search-hero {
    padding: 12px;
  }
}
</style>
