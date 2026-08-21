<template>
  <div class="home-page">
    <SiteHeader @search="search" @write="handleWrite" />

    <main class="page-shell home-shell">
      <section class="welcome-row">
        <div class="welcome-copy">
          <span class="welcome-avatar">{{ avatarText }}</span>
          <div>
            <h1>晚上好，{{ displayName }}</h1>
            <p>在拾光的第 327 天，一起记录生活与灵感吧。</p>
          </div>
        </div>
        <blockquote>
          <span>“</span>
          <p>把平凡的日子过成喜欢的模样，生活和热爱都会发光。</p>
        </blockquote>
      </section>

      <div class="home-grid">
        <section class="feed-column">
          <div class="feature-grid">
            <router-link
              class="feature-card feature-card--large"
              :to="articleRoute(featuredArticles[0])"
            >
              <img :src="bookstoreImage" alt="阳光照进旧书店" />
              <div class="feature-overlay">
                <span class="story-label story-label--coral">精选故事</span>
                <div>
                  <h2>{{ featuredArticles[0].title }}</h2>
                  <p>{{ featuredArticles[0].content }}</p>
                  <div class="story-meta">
                    <span>苏苏在路上</span>
                    <span>♡ 236</span>
                    <span>◌ 42</span>
                  </div>
                </div>
              </div>
            </router-link>

            <div class="feature-stack">
              <router-link
                class="feature-card"
                :to="articleRoute(featuredArticles[1])"
              >
                <img :src="trainImage" alt="夏日海边电车" />
                <div class="feature-overlay feature-overlay--compact">
                  <span class="story-label">旅行日记</span>
                  <div>
                    <h3>{{ featuredArticles[1].title }}</h3>
                    <div class="story-meta">
                      <span>阿 May 不迷路</span>
                      <span>♡ 182</span>
                      <span>◌ 19</span>
                    </div>
                  </div>
                </div>
              </router-link>
              <router-link
                class="feature-card"
                :to="articleRoute(featuredArticles[2])"
              >
                <img :src="journalImage" alt="阳光下的手帐" />
                <div class="feature-overlay feature-overlay--compact">
                  <span class="story-label">设计灵感</span>
                  <div>
                    <h3>{{ featuredArticles[2].title }}</h3>
                    <div class="story-meta">
                      <span>鹿与森</span>
                      <span>♡ 151</span>
                      <span>◌ 27</span>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <section class="article-stream">
            <div class="stream-toolbar">
              <div class="topic-tabs" role="tablist">
                <button
                  v-for="topic in topics"
                  :key="topic"
                  :class="{ active: activeTopic === topic }"
                  @click="activeTopic = topic"
                >
                  {{ topic }}
                </button>
              </div>
              <el-select
                v-model="sortOrder"
                class="sort-select"
                aria-label="文章排序"
              >
                <el-option label="最新发布" value="latest" />
                <el-option label="最多阅读" value="popular" />
              </el-select>
            </div>

            <div class="article-list">
              <article
                v-for="(item, index) in visibleArticles"
                :key="item.articleId || index"
                class="article-row"
              >
                <img
                  :src="index % 2 ? bookstoreImage : journalImage"
                  :alt="item.title"
                />
                <div class="article-row__content">
                  <router-link :to="articleRoute(item)">
                    <h3>{{ item.title }}</h3>
                  </router-link>
                  <p>{{ item.content }}</p>
                  <div class="article-row__meta">
                    <span class="topic-pill">{{ topicFor(item, index) }}</span>
                    <span class="mini-avatar">{{
                      (item.username || "拾").slice(0, 1)
                    }}</span>
                    <span>{{ item.username || "晚风藏书匣" }}</span>
                    <span>{{ index + 2 }} 小时前</span>
                    <span class="meta-spacer"></span>
                    <span>♡ {{ 98 - index * 11 }}</span>
                    <span>◌ {{ 16 - index * 2 }}</span>
                  </div>
                </div>
              </article>
            </div>

            <el-pagination
              v-if="total > queryInfo.pageSize"
              :current-page="queryInfo.pageNo"
              :page-size="queryInfo.pageSize"
              layout="prev, pager, next"
              :total="total"
              @current-change="handleCurrentChange"
            />
          </section>
        </section>

        <aside class="discovery-column">
          <section class="weekly-card">
            <div class="weekly-card__copy">
              <span class="eyebrow">本周共创</span>
              <h2>夏末已至，分享你最近的「小确幸」时刻吧～</h2>
              <div class="weekly-meta">
                <span class="avatar-stack">林 苏 鹿</span>
                <span>等 128 位同好参与</span>
              </div>
              <el-button type="primary" @click="handleWrite"
                >参与共创</el-button
              >
            </div>
            <img
              class="weekly-card__art"
              :src="summerDrinkImage"
              alt="夏日冰饮插画"
            />
          </section>

          <section class="circle-card">
            <div class="aside-heading">
              <h2>推荐圈子</h2>
              <router-link :to="{ name: 'search-circles' }">更多 ›</router-link>
            </div>
            <div
              v-for="(circle, index) in displayCircles"
              :key="circle.circleId || index"
              class="circle-item"
            >
              <img
                :src="circleImages[index % circleImages.length]"
                :alt="circle.circleName"
              />
              <div>
                <router-link :to="`/circles/${circle.circleId || index + 1}`">
                  <strong>{{ circle.circleName }}</strong>
                </router-link>
                <p>
                  {{
                    circle.detail ||
                    circleDescriptions[index % circleDescriptions.length]
                  }}
                </p>
              </div>
              <el-button plain size="small" @click="joinCircle(circle)"
                >加入</el-button
              >
            </div>
          </section>

          <section class="community-note">
            <el-icon>
              <MagicStick />
            </el-icon>
            <div>
              <h3>社区小贴士</h3>
              <p>
                尊重彼此，友善交流
                <br />
                优质内容，值得被看见
              </p>
            </div>
            <img :src="communityNoteImage" alt="自行车与街灯插画" />
          </section>
        </aside>
      </div>
    </main>
  </div>
</template>

<script>
import { MagicStick } from "@element-plus/icons-vue";
import SiteHeader from "@/components/common/SiteHeader.vue";
import bookstoreImage from "@/assets/images/bookstore-feature.webp";
import trainImage from "@/assets/images/coastal-train.webp";
import journalImage from "@/assets/images/journal-notes.webp";
import summerDrinkImage from "@/assets/images/summer-drink.webp";
import communityNoteImage from "@/assets/images/community-note.webp";
import { normalizePage } from "@/services/response";

const fallbackArticles = [
  {
    articleId: 1,
    title: "在旧书店的一下午，遇见另一个自己",
    content:
      "阳光透过木格窗洒在书页上，时间在这里慢了下来。分享我在城市旧书店的随笔与收获。",
    username: "苏苏在路上",
    circleId: 1,
  },
  {
    articleId: 2,
    title: "镰仓海边小旅行：收集夏日的浪漫",
    content: "沿着海岸线慢慢走，把风景与故事都装进行囊。",
    username: "阿 May 不迷路",
    circleId: 2,
  },
  {
    articleId: 3,
    title: "手帐排版小技巧：让灵感被温柔记录",
    content: "从留白、配色到素材选择，分享一套轻松上手的记录方法。",
    username: "鹿与森",
    circleId: 3,
  },
  {
    articleId: 4,
    title: "《悉达多》：在喧嚣世界里寻找内心的河流",
    content: "重读黑塞的《悉达多》，依旧能在字里行间找到平静与力量。",
    username: "晚风藏书匣",
    circleId: 4,
  },
  {
    articleId: 5,
    title: "我的校园角落：图书馆后面的那片梧桐树",
    content: "这里是我每天最喜欢的地方，记录下不同季节的样子。",
    username: "小柚子不酸",
    circleId: 5,
  },
];

const fallbackCircles = [
  { circleId: 1, circleName: "一书一世界", detail: "分享读书笔记与书单" },
  { circleId: 2, circleName: "设计师的日常", detail: "交流设计灵感与作品" },
  { circleId: 3, circleName: "校园碎片", detail: "记录校园生活的点滴" },
  { circleId: 4, circleName: "科技新发现", detail: "探索科技与未来生活" },
];

export default {
  name: "HomePage",
  components: { MagicStick, SiteHeader },
  data() {
    return {
      bookstoreImage,
      trainImage,
      journalImage,
      summerDrinkImage,
      communityNoteImage,
      circleImages: [bookstoreImage, journalImage, trainImage],
      circleDescriptions: [
        "分享读书笔记与书单",
        "交流创意与作品",
        "记录生活里的闪光时刻",
      ],
      queryInfo: { query: "", pageNo: 1, pageSize: 5 },
      circleQuery: { query: "", pageNo: 1, pageSize: 6 },
      ArticleList: [...fallbackArticles],
      words: [...fallbackCircles],
      total: fallbackArticles.length,
      topics: [
        "推荐",
        "最新",
        "关注的人",
        "读书",
        "设计",
        "校园",
        "旅行",
        "科技",
        "生活",
      ],
      activeTopic: "推荐",
      sortOrder: "latest",
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser || {};
    },
    displayName() {
      return this.user.username || "林小满";
    },
    avatarText() {
      return this.displayName.slice(0, 1);
    },
    featuredArticles() {
      return [...this.ArticleList, ...fallbackArticles].slice(0, 3);
    },
    visibleArticles() {
      return (
        this.ArticleList.length ? this.ArticleList : fallbackArticles
      ).slice(0, 5);
    },
    displayCircles() {
      return (this.words.length ? this.words : fallbackCircles).slice(0, 4);
    },
  },
  created() {
    this.getMainCircle();
    this.getArticleList();
  },
  methods: {
    articleRoute(item) {
      return `/articles/${item.articleId || 1}`;
    },
    topicFor(item, index) {
      return (
        item.circleName ||
        ["读书笔记", "校园生活", "设计灵感", "旅行日记"][index % 4]
      );
    },
    search(keyword) {
      this.$router.push({ name: "search-articles", query: { keyword } });
    },
    handleWrite() {
      if (!this.$store.getters.getLoginStatus)
        return this.$router.push({ name: "login" });
      const circle = this.displayCircles[0];
      this.$router.push(`/circles/${circle?.circleId || 1}/articles`);
      this.$message.success("选择一个圈子，开始分享你的故事吧");
    },
    joinCircle(circle) {
      this.$router.push(`/circles/${circle.circleId || 1}`);
    },
    handleCurrentChange(page) {
      this.queryInfo.pageNo = page;
      this.getArticleList();
    },
    getMainCircle() {
      this.$api.circles
        .search(this.circleQuery)
        .then(({ data }) => {
          if (data.success) {
            const { items } = normalizePage(data.data);
            if (items.length) this.words = items;
          }
        })
        .catch(() => {});
    },
    getArticleList() {
      this.$api.articles
        .search(this.queryInfo)
        .then(({ data }) => {
          if (data.success) {
            const { items, total } = normalizePage(data.data);
            if (items.length) this.ArticleList = items;
            this.total = total;
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.home-shell {
  max-width: 1420px;
}

.welcome-row {
  min-height: 96px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 28px;
}

.welcome-copy {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-avatar {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(145deg, #eaa17d, #745bb4);
  font-size: 22px;
  font-weight: 700;
}

.welcome-copy h1 {
  margin: 0 0 6px;
  font-size: 24px;
}

.welcome-copy p {
  margin: 0;
  color: var(--muted);
}

blockquote {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0;
  padding: 14px 22px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.65);
}

blockquote span {
  color: #9d8ac9;
  font:
    700 30px Georgia,
    serif;
}

blockquote p {
  margin: 0;
  color: #665d6a;
  line-height: 1.7;
}

.home-grid {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 24px;
}

.feed-column {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  row-gap: 20px;
}

.discovery-column {
  min-width: 0;
}

.feature-grid {
  position: relative;
  z-index: 0;
  isolation: isolate;
  overflow: clip;
  overflow-clip-margin: 2px;
  width: 100%;
  min-width: 0;
  height: 420px;
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 16px;
}

.feature-stack {
  position: relative;
  z-index: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
}

.feature-card {
  position: relative;
  z-index: 0;
  contain: paint;
  overflow: hidden;
  min-height: 0;
  border-radius: 16px;
  background: #3a2d3d;
  color: #fff;
}

.feature-card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.45s ease;
}

.feature-card:hover img {
  transform: scale(1.035);
}

.feature-card::after {
  content: "";
  position: absolute;
  inset: 30% 0 0;
  background: linear-gradient(transparent, rgba(27, 18, 27, 0.9));
}

.feature-overlay {
  position: absolute;
  z-index: 1;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px;
}

.feature-overlay h2 {
  margin: 0 0 8px;
  font-size: clamp(22px, 2vw, 30px);
  line-height: 1.3;
}

.feature-overlay h3 {
  margin: 0 0 8px;
  font-size: 18px;
  line-height: 1.4;
}

.feature-overlay p {
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.84);
  line-height: 1.7;
}

.feature-overlay--compact {
  padding: 16px;
}

.story-label {
  align-self: flex-start;
  padding: 5px 9px;
  border-radius: 7px;
  background: rgba(100, 88, 103, 0.66);
  backdrop-filter: blur(8px);
  font-size: 12px;
}

.story-label--coral {
  background: rgba(220, 112, 78, 0.9);
}

.story-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: rgba(255, 255, 255, 0.86);
  font-size: 12px;
}

.article-stream {
  position: relative;
  z-index: 2;
  isolation: isolate;
  clear: both;
  min-width: 0;
  margin-top: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
}

.stream-toolbar {
  position: relative;
  z-index: 1;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 18px;
  border-bottom: 1px solid var(--line);
  background: var(--surface);
}

.topic-tabs {
  display: flex;
  align-self: stretch;
  overflow-x: auto;
}

.topic-tabs button {
  position: relative;
  padding: 0 14px;
  border: 0;
  background: transparent;
  color: #605865;
  cursor: pointer;
  white-space: nowrap;
}

.topic-tabs button.active {
  color: var(--brand);
  font-weight: 700;
}

.topic-tabs button.active::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 0;
  height: 3px;
  border-radius: 2px;
  background: var(--brand);
}

.sort-select {
  width: 118px;
}

.article-row {
  display: grid;
  grid-template-columns: 258px 1fr;
  gap: 20px;
  padding: 18px;
  border-bottom: 1px solid var(--line);
}

.article-row:last-child {
  border-bottom: 0;
}

.article-row > img {
  width: 100%;
  height: 132px;
  border-radius: 12px;
  object-fit: cover;
}

.article-row__content {
  min-width: 0;
}

.article-row h3 {
  margin: 4px 0 8px;
  font-size: 18px;
}

.article-row h3:hover {
  color: var(--brand);
}

.article-row p {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-row__meta {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 16px;
  color: #948d96;
  font-size: 12px;
}

.topic-pill {
  padding: 4px 8px;
  border-radius: 7px;
  background: var(--brand-soft);
  color: var(--brand);
}

.mini-avatar {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: #8e789a;
}

.meta-spacer {
  flex: 1;
}

.article-stream :deep(.el-pagination) {
  padding: 0 18px 18px;
}

.discovery-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weekly-card,
.circle-card,
.community-note {
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
}

.weekly-card {
  position: relative;
  min-height: 250px;
  overflow: hidden;
  background: #fbf7fd;
}

.weekly-card__copy {
  position: relative;
  z-index: 1;
  max-width: 210px;
}

.weekly-card__art {
  position: absolute;
  right: -18px;
  bottom: -8px;
  width: 150px;
  height: 140px;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.eyebrow {
  color: var(--brand);
  font-weight: 700;
}

.weekly-card h2 {
  margin: 12px 0 20px;
  font-size: 18px;
  line-height: 1.65;
}

.weekly-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: var(--muted);
  font-size: 12px;
}

.avatar-stack {
  padding: 5px 8px;
  border-radius: 20px;
  color: #fff;
  background: #8f7aa7;
  letter-spacing: -0.1em;
}

.aside-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.aside-heading h2 {
  margin: 0;
  font-size: 21px;
}

.aside-heading a {
  color: var(--muted);
  font-size: 13px;
}

.circle-item {
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
}

.circle-item img {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  object-fit: cover;
}

.circle-item strong {
  font-size: 14px;
}

.circle-item p {
  overflow: hidden;
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.circle-item .el-button {
  padding: 7px 11px;
  color: var(--brand);
}

.community-note {
  position: relative;
  min-height: 170px;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  color: var(--brand);
  background: var(--surface-soft);
}

.community-note .el-icon {
  margin-top: 4px;
  font-size: 22px;
}

.community-note h3 {
  margin: 0 0 10px;
}

.community-note p {
  margin: 0;
  color: var(--muted);
  line-height: 1.75;
}

.community-note img {
  position: absolute;
  right: -22px;
  bottom: -20px;
  width: 190px;
  height: 125px;
  object-fit: contain;
  mix-blend-mode: multiply;
  opacity: 0.82;
}

@media (max-width: 1080px) {
  .home-grid {
    grid-template-columns: 1fr;
  }

  .discovery-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .community-note {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .welcome-row {
    grid-template-columns: minmax(0, 1fr);
    padding-bottom: 18px;
  }

  blockquote {
    display: none;
  }

  .home-grid,
  .feature-grid,
  .feature-stack {
    min-width: 0;
  }

  .feature-grid {
    height: auto;
    grid-template-columns: minmax(0, 1fr);
  }

  .feature-card--large {
    width: 100%;
    height: 340px;
  }

  .feature-stack {
    width: 100%;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: 190px;
  }

  .article-row {
    grid-template-columns: 110px minmax(0, 1fr);
    gap: 12px;
    padding: 14px;
  }

  .article-row > img {
    height: 100px;
  }

  .article-row p,
  .article-row__meta span:nth-last-child(-n + 3) {
    display: none;
  }

  .article-row__meta {
    margin-top: 10px;
  }

  .discovery-column {
    grid-template-columns: minmax(0, 1fr);
  }

  .community-note {
    grid-column: auto;
  }
}

@media (max-width: 520px) {
  .feature-stack {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 190px);
  }

  .feature-overlay p {
    display: none;
  }

  .stream-toolbar {
    padding: 0 8px;
  }

  .topic-tabs button {
    padding: 0 10px;
  }

  .sort-select {
    display: none;
  }
}
</style>
