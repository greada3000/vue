<template>
  <div class="inner-page">
    <SiteHeader @search="search" @write="openEditor" />
    <main class="page-shell">
      <section class="profile-hero circle-hero">
        <div class="profile-identity">
          <span class="avatar">{{ (circle.circleName || "圈").slice(0, 1) }}</span>
          <div>
            <p class="eyebrow">兴趣圈子</p>
            <h1>{{ circle.circleName || `圈子 ${$route.params.id}` }}</h1>
            <p>
              {{ circle.detail || "和有共同兴趣的人一起交流、记录与成长。" }}
            </p>
          </div>
        </div>
        <div>
          <el-button @click="joined = !joined">{{ joined ? "已加入" : "+ 加入圈子" }}</el-button>
          <el-button type="primary" @click="openEditor">写文章</el-button>
        </div>
      </section>
      <el-menu class="section-menu" mode="horizontal" :default-active="$route.name" router>
        <el-menu-item index="circle-overview" :route="{ name: 'circle-overview', params: { id: $route.params.id } }">
          圈子主页
        </el-menu-item>
        <el-menu-item index="circle-articles" :route="{ name: 'circle-articles', params: { id: $route.params.id } }">
          全部文章
        </el-menu-item>
      </el-menu>
      <router-view />
    </main>
    <el-dialog v-model="editorVisible" title="在圈子里写文章" width="min(620px, 92vw)">
      <el-form :model="article" label-position="top">
        <el-form-item label="文章标题">
          <el-input v-model="article.title" placeholder="给你的故事起一个好标题" />
        </el-form-item>
        <el-form-item label="正文">
          <el-input v-model="article.content" type="textarea" :rows="8" placeholder="分享真实、有价值的内容…" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="primary" @click="save">发布文章</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import SiteHeader from "@/components/common/SiteHeader.vue";
export default {
  name: "CircleLayout",
  components: { SiteHeader },
  data() {
    return {
      circle: {},
      joined: false,
      editorVisible: false,
      article: {
        title: "",
        content: "",
        circle: this.$route.params.id,
        userid: this.$store.getters.getUser?.name,
        username: this.$store.getters.getUser?.username,
      },
    };
  },
  created() {
    this.$api.circles
      .get(this.$route.params.id)
      .then(({ data }) => {
        if (data.success) this.circle = data.data;
      })
      .catch(() => {});
  },
  methods: {
    search(keyword) {
      this.$router.push({ name: "search-articles", query: { keyword } });
    },
    openEditor() {
      if (!this.$store.getters.getLoginStatus) return this.$router.push({ name: "login" });
      this.editorVisible = true;
    },
    save() {
      if (!this.article.title || !this.article.content) return this.$message.warning("请填写标题和正文");
      this.$api.articles.create(this.article).then(({ data }) => {
        if (data.success) {
          this.editorVisible = false;
          this.$message.success("发布成功");
          this.$router.push({
            name: "circle-articles",
            params: { id: this.$route.params.id },
          });
        }
      });
    },
  },
};
</script>
