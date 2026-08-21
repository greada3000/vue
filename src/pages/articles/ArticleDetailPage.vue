<template>
  <div class="inner-page">
    <SiteHeader @search="search" />
    <main class="doc-layout">
      <aside class="left-rail">
        <section class="series-summary">
          <small><Collection /> 正在阅读</small>
          <h2>生活方式设计手册</h2>
          <p><Clock /> 预计阅读 12 分钟</p>
          <router-link :to="`/circles/${article.circleId || 1}/articles`"
            ><ArrowLeft /> 返回推文列表</router-link
          >
        </section>
        <nav class="chapter-nav" aria-label="系列目录">
          <h3><Menu /> 系列目录</h3>
          <button
            v-for="chapter in chapters"
            :key="chapter.order"
            :class="{ active: chapter.active }"
            @click="selectChapter(chapter)"
          >
            <span>{{ String(chapter.order).padStart(2, "0") }}</span
            >{{ chapter.title }}
          </button>
        </nav>
      </aside>

      <div class="center-column">
        <article class="article-card">
          <header class="article-header">
            <div class="meta">
              <span>{{ article.circleName }}</span
              >{{ article.updatedAt }}
            </div>
            <h1>{{ article.title }}</h1>
            <p class="summary">{{ article.summary }}</p>
            <div class="author">
              <span class="avatar">{{ article.username.slice(0, 1) }}</span>
              <div>
                <strong>{{ article.username }}</strong
                ><small>发布于 2026-08-19 · {{ wordCount }} 字</small>
              </div>
            </div>
          </header>
          <figure>
            <img :src="coverImage" alt="安静的书店阅读空间" />
            <figcaption>
              让空间少一点噪声，给真正重要的事多一点位置。
            </figcaption>
          </figure>
          <div ref="articleBody" class="article-body">
            <section
              v-for="section in article.sections"
              :id="section.id"
              :key="section.id"
            >
              <h2>{{ section.title }}</h2>
              <p class="lead">{{ section.lead }}</p>
              <template v-for="block in section.blocks" :key="block.id">
                <h3 v-if="block.type === 'heading'" :id="block.id">
                  {{ block.text }}
                </h3>
                <p v-else-if="block.type === 'paragraph'">{{ block.text }}</p>
                <blockquote v-else-if="block.type === 'quote'">
                  {{ block.text }}
                </blockquote>
                <ul v-else-if="block.type === 'list'">
                  <li v-for="item in block.items" :key="item">{{ item }}</li>
                </ul>
                <div v-else class="steps">
                  <div v-for="(item, i) in block.items" :key="item.title">
                    <b>{{ i + 1 }}</b>
                    <p>
                      <strong>{{ item.title }}</strong
                      ><small>{{ item.text }}</small>
                    </p>
                  </div>
                </div>
              </template>
            </section>
          </div>
          <footer class="article-actions">
            <el-button plain><Star /> 喜欢</el-button
            ><el-button plain><CollectionTag /> 收藏</el-button
            ><el-button plain><Share /> 分享</el-button>
          </footer>
        </article>

        <section class="comments-card">
          <h2>
            评论 <span>{{ reviewlist.length }}</span>
          </h2>
          <p>友善交流，让观点彼此照亮。</p>
          <div class="comment-editor">
            <span class="avatar">{{ currentAvatar }}</span
            ><el-input
              v-model="review.content"
              type="textarea"
              :rows="3"
              maxlength="300"
              show-word-limit
              placeholder="写下你的想法…"
            /><el-button type="primary" @click="makeReview">发表评论</el-button>
          </div>
          <article v-for="item in reviewlist" :key="item.id" class="comment">
            <span class="avatar">{{ String(item.ownerId).slice(0, 1) }}</span>
            <div>
              <strong>用户 {{ item.ownerId }}</strong>
              <p>{{ item.content }}</p>
              <small>刚刚 · 回复</small>
            </div>
          </article>
          <el-empty
            v-if="!reviewlist.length"
            description="还没有评论，来分享第一个想法吧"
          />
        </section>
      </div>

      <aside class="right-rail">
        <nav class="outline-nav" aria-label="本文目录">
          <h3>本文目录</h3>
          <button
            v-for="item in outline"
            :key="item.id"
            :class="[
              `level-${item.level}`,
              { active: activeHeadingId === item.id },
            ]"
            @click="scrollTo(item.id)"
          >
            {{ item.text }}
          </button>
          <div class="progress">
            <i :style="{ width: `${readingProgress}%` }"></i>
          </div>
          <small>阅读进度 {{ readingProgress }}%</small>
        </nav>
      </aside>
    </main>
  </div>
</template>

<script>
import {
  ArrowLeft,
  Clock,
  Collection,
  CollectionTag,
  Menu,
  Share,
  Star,
} from "@element-plus/icons-vue";
import SiteHeader from "@/components/common/SiteHeader.vue";
import coverImage from "@/assets/images/bookstore-feature.webp";

const sections = [
  {
    id: "space-and-focus",
    title: "空间为什么会影响我们的注意力",
    lead: "房间从来不只是容器。视线所到之处的每一个物件，都在悄悄向大脑发出一次处理请求。",
    blocks: [
      {
        id: "visual-noise",
        type: "heading",
        text: "看得见的杂乱，也是一种信息",
      },
      {
        id: "p1",
        type: "paragraph",
        text: "当桌面同时摆着快递盒、未读完的书、充电线和几张票据，我们并不会真的忽略它们。大脑会不断判断它们是否重要、是否需要处理。单次判断很轻，叠加起来却足以让一次原本专注的阅读变得断断续续。",
      },
      {
        id: "q1",
        type: "quote",
        text: "整理不是把生活藏起来，而是决定什么值得持续出现在视线里。",
      },
      { id: "focus-anchor", type: "heading", text: "给房间设置一个注意力锚点" },
      {
        id: "p2",
        type: "paragraph",
        text: "试着为每个区域只保留一个视觉中心：书桌上是一盏灯和正在读的书，玄关是一只托盘，床边是一杯水。明确的中心会让空间更容易被理解，也能减少开始一件事之前的心理阻力。",
      },
    ],
  },
  {
    id: "three-layers",
    title: "三层整理法：留下、归位、隐藏",
    lead: "不要从购买收纳盒开始。先判断物品与生活的关系，再决定它应该出现在哪里。",
    blocks: [
      { id: "keep", type: "heading", text: "第一层：留下服务于当下的物品" },
      {
        id: "l1",
        type: "list",
        items: [
          "最近一个月确实使用过",
          "能明确说出下一次使用场景",
          "带来的愉悦大于维护成本",
          "无法替代且值得长期保存",
        ],
      },
      { id: "place", type: "heading", text: "第二层：让使用路径决定位置" },
      {
        id: "p3",
        type: "paragraph",
        text: "物品应该待在动作发生的地方，而不是待在看起来最整齐的地方。剪刀放在拆快递的位置，阅读笔放在常坐的椅子旁。好的归位规则不需要记忆，它会顺着习惯自然发生。",
      },
      { id: "hide", type: "heading", text: "第三层：把低频信息移出视线" },
      {
        id: "p4",
        type: "paragraph",
        text: "证件、备用线材和纪念品仍然重要，但不必每天被看见。使用统一且带标签的封闭容器，把开放空间留给当前生活。标签写类别和场景，比写模糊的“杂物”更有帮助。",
      },
    ],
  },
  {
    id: "weekend-plan",
    title: "一个周末的实践清单",
    lead: "不用一次整理整套房子。选择一个每天都会经过的小区域，完整走完下面四步。",
    blocks: [
      {
        id: "four-steps",
        type: "steps",
        items: [
          {
            title: "清空",
            text: "取出物品并擦拭表面，看清这个区域的真实边界。",
          },
          {
            title: "筛选",
            text: "按照使用频率与当下需求，而不是购买价格作决定。",
          },
          { title: "归位", text: "高频物品触手可及，低频物品离开视线。" },
          { title: "复盘", text: "使用一周后微调，真正有效的系统应该顺手。" },
        ],
      },
      {
        id: "start-small",
        type: "heading",
        text: "从一个抽屉开始，也完全足够",
      },
      {
        id: "p5",
        type: "paragraph",
        text: "改变生活环境最难的部分通常不是整理，而是决定从哪里开始。把目标缩小到一个抽屉、一个书架或一平方米的桌面，完成后停下来感受差异。小范围的确定感，会自然推动下一次行动。",
      },
    ],
  },
  {
    id: "keep-running",
    title: "让系统持续运转",
    lead: "整洁不是一种永久状态，而是一套可以低成本重复的动作。",
    blocks: [
      { id: "reset", type: "heading", text: "每天五分钟的空间复位" },
      {
        id: "p6",
        type: "paragraph",
        text: "睡前用五分钟把杯子带回厨房、纸张放入待处理盒、书本回到固定位置。不要在这五分钟里做复杂分类，只恢复空间的基本秩序。任务足够轻，才容易长期坚持。",
      },
      { id: "one-in-one-out", type: "heading", text: "建立一进一出的温和边界" },
      {
        id: "p7",
        type: "paragraph",
        text: "当同类物品达到空间上限，新物品进入时就选择一件离开。这不是惩罚消费，而是在提醒我们：房间容量有限，注意力也有限。为喜欢的东西留出呼吸感，本身就是一种珍惜。",
      },
    ],
  },
];

const demo = {
  circleId: 1,
  circleName: "生活实验室",
  userId: 1,
  username: "拾光编辑部",
  updatedAt: "更新于 2026-08-20",
  title: "把生活过成一座安静的图书馆",
  summary:
    "从空间、时间到注意力，一套可以在周末完成的轻量整理法。不是追求空无一物，而是让每件留下来的东西都有意义。",
  sections,
};

export default {
  name: "ArticleDetailPage",
  components: {
    ArrowLeft,
    Clock,
    Collection,
    CollectionTag,
    Menu,
    Share,
    SiteHeader,
    Star,
  },
  data() {
    return {
      coverImage,
      article: structuredClone(demo),
      activeHeadingId: sections[0].id,
      readingProgress: 0,
      observer: null,
      chapters: [
        "重新认识你的生活空间",
        "找到适合自己的节奏",
        "建立低负担的收纳系统",
        "把生活过成安静的图书馆",
        "为日常保留一点空白",
        "让好习惯自然发生",
      ].map((title, i) => ({ title, order: i + 1, active: i === 3 })),
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
    outline() {
      return this.article.sections.flatMap((s) => [
        { id: s.id, text: s.title, level: 2 },
        ...s.blocks
          .filter((b) => b.type === "heading")
          .map((b) => ({ id: b.id, text: b.text, level: 3 })),
      ]);
    },
    wordCount() {
      return JSON.stringify(this.article.sections).replace(/[\W_]/g, "").length;
    },
  },
  created() {
    if (this.$route.params.aid !== "demo") this.loadArticle();
    this.getReviews();
  },
  mounted() {
    this.$nextTick(this.observe);
    window.addEventListener("scroll", this.updateProgress, { passive: true });
  },
  beforeUnmount() {
    this.observer?.disconnect();
    window.removeEventListener("scroll", this.updateProgress);
  },
  methods: {
    search(keyword) {
      this.$router.push({ name: "search-articles", query: { keyword } });
    },
    selectChapter(item) {
      item.active
        ? window.scrollTo({ top: 0, behavior: "smooth" })
        : this.$message.info(`“${item.title}”为目录交互示例`);
    },
    scrollTo(id) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    },
    observe() {
      this.observer?.disconnect();
      this.observer = new IntersectionObserver(
        (entries) => {
          const hit = entries
            .filter((e) => e.isIntersecting)
            .sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
            )[0];
          if (hit) this.activeHeadingId = hit.target.id;
        },
        { rootMargin: "-110px 0px -68% 0px" },
      );
      this.outline.forEach((x) => {
        const el = document.getElementById(x.id);
        if (el) this.observer.observe(el);
      });
      this.updateProgress();
    },
    updateProgress() {
      const el = this.$refs.articleBody;
      if (!el) return;
      const distance = Math.max(el.offsetHeight - innerHeight * 0.55, 1);
      this.readingProgress = Math.min(
        100,
        Math.max(
          0,
          Math.round(((scrollY - el.offsetTop + 150) / distance) * 100),
        ),
      );
    },
    loadArticle() {
      this.$api.articles
        .get(this.$route.params.aid)
        .then(({ data }) => {
          const item = data.data;
          if (!item) return;
          this.article = {
            ...demo,
            ...item,
            summary: item.summary || "一篇来自拾光社区的认真分享。",
            sections: [
              {
                id: "content",
                title: "正文",
                lead: "",
                blocks: String(item.content || "")
                  .split(/\n{2,}/)
                  .filter(Boolean)
                  .map((text, i) => ({
                    id: `p-${i}`,
                    type: "paragraph",
                    text,
                  })),
              },
            ],
          };
          this.$nextTick(this.observe);
        })
        .catch(() => {});
    },
    getReviews() {
      if (this.$route.params.aid === "demo") return;
      this.$api.reviews
        .byArticle(this.$route.params.aid)
        .then(({ data }) => {
          if (data.success) this.reviewlist = data.data || [];
        })
        .catch(() => {});
    },
    makeReview() {
      if (!this.$store.getters.getLoginStatus)
        return this.$router.push({ name: "login" });
      if (!this.review.content.trim())
        return this.$message.warning("请输入评论内容");
      if (this.$route.params.aid === "demo") {
        this.reviewlist.unshift({
          id: Date.now(),
          ownerId: this.review.ownerId || "我",
          content: this.review.content,
        });
        this.review.content = "";
        return this.$message.success("评论已添加到演示页面");
      }
      this.$api.reviews.create(this.review).then(({ data }) => {
        if (data.success) {
          this.review.content = "";
          this.getReviews();
        }
      });
    },
  },
};
</script>

<style scoped>
.doc-layout {
  width: min(1580px, calc(100% - 48px));
  margin: auto;
  padding: 30px 0 70px;
  display: grid;
  grid-template-columns: 240px minmax(0, 850px) 220px;
  justify-content: center;
  align-items: start;
  gap: 28px;
}
.left-rail,
.right-rail {
  position: sticky;
  top: 112px;
  max-height: calc(100vh - 136px);
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.left-rail::-webkit-scrollbar,
.right-rail::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
.series-summary,
.chapter-nav,
.outline-nav,
.article-card,
.comments-card {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--surface);
}
.series-summary {
  padding: 22px;
  text-align: center;
  background: linear-gradient(155deg, #fffdfa, #f2ecfa);
}
.series-summary small,
.series-summary p {
  color: var(--muted);
}
.series-summary svg,
.chapter-nav svg,
.article-actions svg {
  width: 16px;
  vertical-align: -3px;
}
.series-summary h2 {
  margin: 12px 0;
  font-size: 18px;
}
.series-summary p {
  margin: 0 0 18px;
  font-size: 12px;
}
.series-summary a {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 10px;
  color: white;
  background: var(--brand);
  font-size: 13px;
  font-weight: 700;
}
.chapter-nav {
  margin-top: 14px;
  padding: 18px 10px;
}
.chapter-nav h3,
.outline-nav h3 {
  margin: 0 10px 12px;
  color: var(--brand-dark);
  font-size: 14px;
}
.chapter-nav button {
  width: 100%;
  display: grid;
  grid-template-columns: 25px 1fr;
  gap: 7px;
  padding: 10px;
  border: 0;
  border-radius: 9px;
  color: #655e68;
  background: none;
  text-align: left;
  line-height: 1.4;
  cursor: pointer;
}
.chapter-nav button span {
  color: #aaa1ac;
  font-size: 11px;
}
.chapter-nav button:hover,
.chapter-nav button.active {
  background: var(--brand-soft);
}
.chapter-nav button.active {
  color: var(--brand-dark);
  font-weight: 700;
}
.center-column {
  min-width: 0;
}
.article-card {
  overflow: hidden;
}
.article-header {
  padding: 48px 58px 30px;
}
.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--muted);
  font-size: 12px;
}
.meta span {
  padding: 6px 10px;
  border-radius: 99px;
  color: var(--brand-dark);
  background: var(--brand-soft);
  font-weight: 700;
}
.article-header h1 {
  margin: 18px 0 15px;
  font-family: "Songti SC", STSong, serif;
  font-size: clamp(34px, 4vw, 48px);
  line-height: 1.22;
}
.summary {
  color: #6f6872;
  font-size: 16px;
  line-height: 1.85;
}
.author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}
.author small {
  display: block;
  margin-top: 4px;
  color: var(--muted);
}
figure {
  margin: 0 30px;
}
figure img {
  width: 100%;
  height: 390px;
  display: block;
  border-radius: 16px;
  object-fit: cover;
}
figcaption {
  padding-top: 10px;
  color: #999099;
  font-size: 12px;
  text-align: center;
}
.article-body {
  padding: 20px 58px 44px;
  color: #484149;
  font-family: "Songti SC", STSong, "Microsoft YaHei", serif;
  font-size: 17px;
  line-height: 2;
}
.article-body section {
  padding-top: 34px;
  scroll-margin-top: 115px;
}
.article-body h2 {
  margin: 0 0 14px;
  color: #302833;
  font-family: var(--el-font-family);
  font-size: 28px;
  line-height: 1.4;
}
.article-body h3 {
  margin: 32px 0 8px;
  color: #403543;
  font-family: var(--el-font-family);
  font-size: 20px;
  scroll-margin-top: 115px;
}
.article-body p {
  margin: 12px 0;
}
.article-body .lead {
  padding-left: 16px;
  border-left: 3px solid #d6c9ed;
  color: #6b626e;
}
.article-body blockquote {
  margin: 28px 0;
  padding: 20px 24px;
  border-radius: 12px;
  color: #584967;
  background: #f5f0fb;
  font-size: 19px;
}
.article-body ul {
  padding: 18px 24px 18px 46px;
  border-radius: 12px;
  background: #faf7f2;
}
.steps {
  display: grid;
  gap: 10px;
  margin: 24px 0;
}
.steps > div {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 12px;
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: 12px;
}
.steps b {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: white;
  background: var(--brand);
  font-family: sans-serif;
}
.steps p {
  margin: 0;
}
.steps small {
  display: block;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}
.article-actions {
  display: flex;
  gap: 8px;
  padding: 0 58px 38px;
}
.article-actions .el-button {
  gap: 5px;
}
.outline-nav {
  padding: 18px;
}
.outline-nav h3 {
  margin-left: 0;
  color: var(--ink);
  font-size: 16px;
}
.outline-nav button {
  width: 100%;
  padding: 6px 0;
  overflow: hidden;
  border: 0;
  color: #817982;
  background: none;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.outline-nav button.level-3 {
  padding-left: 14px;
  font-size: 12px;
}
.outline-nav button.active {
  color: var(--brand-dark);
  font-weight: 700;
}
.progress {
  height: 5px;
  margin-top: 16px;
  overflow: hidden;
  border-radius: 5px;
  background: #eee9e5;
}
.progress i {
  height: 100%;
  display: block;
  background: var(--brand);
}
.outline-nav > small {
  display: block;
  margin-top: 8px;
  color: var(--muted);
}
.comments-card {
  margin-top: 20px;
  padding: 30px;
}
.comments-card h2 {
  margin: 0;
}
.comments-card h2 span {
  color: var(--brand);
  font-size: 15px;
}
.comments-card > p {
  margin: 6px 0 22px;
  color: var(--muted);
}
.comment-editor {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 12px;
}
.comment {
  display: flex;
  gap: 14px;
  padding: 20px 0;
  border-top: 1px solid var(--line);
}
.comment p {
  margin: 8px 0;
}
.comment small {
  color: var(--muted);
}
@media (max-width: 1280px) {
  .doc-layout {
    grid-template-columns: 220px minmax(0, 820px);
  }
  .right-rail {
    display: none;
  }
}
@media (max-width: 900px) {
  .doc-layout {
    width: min(760px, calc(100% - 28px));
    grid-template-columns: 1fr;
  }
  .left-rail {
    position: static;
    max-height: none;
  }
  .chapter-nav {
    display: none;
  }
  .series-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
  }
  .series-summary small,
  .series-summary p {
    display: none;
  }
  .series-summary h2 {
    margin: 0;
  }
  .series-summary a {
    padding: 0 14px;
  }
}
@media (max-width: 620px) {
  .doc-layout {
    width: calc(100% - 20px);
    padding-top: 12px;
  }
  .series-summary {
    padding: 14px;
  }
  .series-summary h2 {
    font-size: 14px;
  }
  .series-summary a {
    font-size: 0;
  }
  .article-header,
  .article-body {
    padding-left: 22px;
    padding-right: 22px;
  }
  .article-header {
    padding-top: 30px;
  }
  .article-header h1 {
    font-size: 32px;
  }
  figure {
    margin: 0 10px;
  }
  figure img {
    height: 245px;
  }
  .article-body {
    font-size: 16px;
  }
  .article-body h2 {
    font-size: 24px;
  }
  .article-actions {
    padding: 0 22px 28px;
    overflow: auto;
  }
  .comments-card {
    padding: 20px;
  }
  .comment-editor {
    grid-template-columns: 1fr;
  }
  .comment-editor > .avatar {
    display: none;
  }
  .comment-editor .el-button {
    justify-self: end;
  }
}
</style>
