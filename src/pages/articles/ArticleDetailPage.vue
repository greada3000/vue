<template>
  <div class="inner-page">
    <SiteHeader @search="search" />
    <main class="page-shell article-page">
      <article class="article-paper">
        <div class="article-heading">
          <span class="topic-pill">{{ article.circleName || `圈子 ${article.circleId || ""}` }}</span>
          <h1>{{ article.title || "正在加载文章…" }}</h1>
          <div class="byline">
            <span class="avatar">{{ (article.username || "拾").slice(0, 1) }}</span>
            <div>
              <router-link :to="`/users/${article.userId || ''}`">
                <strong>{{ article.username || "拾光创作者" }}</strong>
              </router-link>
              <p>发布于 2026-08-19 · 预计阅读 5 分钟</p>
            </div>
          </div>
        </div>
        <div class="article-cover">
          <img :src="coverImage" alt="文章配图" />
        </div>
        <div class="article-body">
          {{
            article.content ||
            "每一次认真记录，都会让平凡的日子多一份光亮。这里承载着作者想与社区分享的故事、经验与思考。"
          }}
        </div>
        <div class="article-actions">
          <el-button plain>♡ 喜欢</el-button>
          <el-button plain>收藏</el-button>
          <el-button plain>分享</el-button>
        </div>
      </article>
      <section class="comments-card">
        <div class="comments-heading">
          <h2>
            评论
            <span>{{ reviewlist.length }}</span>
          </h2>
          <p>友善交流，让观点彼此照亮。</p>
        </div>
        <div class="comment-editor">
          <span class="avatar">{{ currentAvatar }}</span>
          <el-input
            v-model="review.content"
            type="textarea"
            :rows="3"
            maxlength="300"
            show-word-limit
            placeholder="写下你的想法…" />
          <el-button type="primary" @click="makeReview">发表评论</el-button>
        </div>
        <div v-if="reviewlist.length" class="comment-list">
          <article v-for="(item, index) in reviewlist" :key="item.id || index" class="comment-item">
            <span class="avatar">{{ String(item.ownerId || "拾").slice(0, 1) }}</span>
            <div>
              <router-link :to="`/users/${item.ownerId}`">
                <strong>用户 {{ item.ownerId }}</strong>
              </router-link>
              <p>{{ item.content }}</p>
              <small>刚刚 · 回复</small>
            </div>
          </article>
        </div>
        <el-empty v-else description="还没有评论，来分享第一个想法吧" />
      </section>
    </main>
  </div>
</template>
<script>
import SiteHeader from "@/components/common/SiteHeader.vue";
import coverImage from "@/assets/images/bookstore-feature.png";
export default {
  name: "ArticleDetailPage",
  components: { SiteHeader },
  data() {
    return {
      coverImage,
      article: {},
      reviewlist: [],
      review: {
        ownerId: this.$store.getters.getUser?.name,
        articleId: this.$route.params.aid,
        content: "",
      },
    };
  },
  computed: {
    currentAvatar() {
      return (this.$store.getters.getUser?.username || "我").slice(0, 1);
    },
  },
  created() {
    this.loadArticle();
    this.getReviewList();
  },
  methods: {
    search(keyword) {
      this.$router.push({ name: "search-articles", query: { keyword } });
    },
    loadArticle() {
      this.$api.articles
        .get(this.$route.params.aid)
        .then(({ data }) => {
          if (data.success !== false) this.article = data.data || {};
        })
        .catch(() => {});
    },
    getReviewList() {
      this.$api.reviews
        .byArticle(this.$route.params.aid)
        .then(({ data }) => {
          if (data.success) this.reviewlist = data.data || [];
        })
        .catch(() => {});
    },
    makeReview() {
      if (!this.$store.getters.getLoginStatus) return this.$router.push({ name: "login" });
      if (!this.review.content.trim()) return this.$message.warning("请输入评论内容");
      this.$api.reviews.create(this.review).then(({ data }) => {
        if (data.success) {
          this.review.content = "";
          this.$message.success("评论成功");
          this.getReviewList();
        }
      });
    },
  },
};
</script>
<style scoped>
.article-page {
  max-width: 960px;
}

.article-paper,
.comments-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--surface);
}

.article-heading {
  padding: 48px 60px 30px;
}

.article-heading h1 {
  margin: 18px 0 24px;
  font-size: clamp(30px, 5vw, 48px);
  line-height: 1.25;
}

.byline {
  display: flex;
  align-items: center;
  gap: 12px;
}

.byline .avatar,
.comment-editor .avatar,
.comment-item .avatar {
  flex: 0 0 auto;
}

.byline p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.article-cover {
  height: 430px;
  margin: 0 30px;
  overflow: hidden;
  border-radius: 16px;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-body {
  padding: 42px 60px;
  color: #4d4650;
  font-size: 17px;
  line-height: 2;
  white-space: pre-wrap;
}

.article-actions {
  display: flex;
  gap: 8px;
  padding: 0 60px 36px;
}

.comments-card {
  margin-top: 20px;
  padding: 30px;
}

.comments-heading h2 {
  margin: 0;
}

.comments-heading h2 span {
  color: var(--brand);
  font-size: 15px;
}

.comments-heading p {
  margin: 6px 0 22px;
  color: var(--muted);
}

.comment-editor {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: start;
  gap: 12px;
}

.comment-list {
  margin-top: 26px;
}

.comment-item {
  display: flex;
  gap: 14px;
  padding: 20px 0;
  border-top: 1px solid var(--line);
}

.comment-item p {
  margin: 8px 0;
  line-height: 1.7;
}

.comment-item small {
  color: var(--muted);
}

@media (max-width: 680px) {
  .article-heading,
  .article-body {
    padding: 28px 22px;
  }

  .article-cover {
    height: 260px;
    margin: 0 12px;
  }

  .article-actions {
    padding: 0 22px 28px;
  }

  .comments-card {
    padding: 20px;
  }

  .comment-editor {
    grid-template-columns: 1fr;
  }

  .comment-editor .avatar {
    display: none;
  }

  .comment-editor .el-button {
    justify-self: end;
  }
}
</style>
