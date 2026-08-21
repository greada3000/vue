<template>
  <div id="poster" class="scrollbar">
    <el-scrollbar style="height: 75%">
      <!-- <span>wode搜索主页</span> -->
      <!-- <span>{{$route.params.id}}</span> -->
      <el-col :span="20" :offset="2">
        <el-card>
          <div v-for="(item, i) in articlelist" :key="i">
            <el-card>
              <template #header>
                <div class="clearfix">
                  <span style="line-height: 36px">
                    <router-link target="_blank" :to="'/articles/' + item.articleId">
                      <h4>{{ item.title }}</h4>
                    </router-link>
                  </span>
                  <h5>
                    作者：
                    <router-link target="_blank" :to="'/users/' + item.userId">{{ item.username }}</router-link>
                    | 圈子：
                    <router-link target="_blank" :to="'/circles/' + item.circleId">{{ item.circleId }}</router-link>
                  </h5>
                </div>
              </template>
              <div class="article-content">
                {{ item.content }}
              </div>
            </el-card>
          </div>
        </el-card>
      </el-col>
    </el-scrollbar>

    <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNo"
            :page-sizes="[3, 4, 5, 10]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination> -->
  </div>
</template>

<script>
import { normalizePage } from "@/services/response";

export default {
  name: "CircleArticlesPage",
  data() {
    return {
      articlelist: [],
      total: 0,
    };
  },
  created() {
    this.getMyArticle();
  },
  methods: {
    getMyArticle() {
      this.$api.articles.byCircle(this.$route.params.id).then((resp) => {
        let data = resp.data;
        if (data.success) {
          const page = normalizePage(data.data);
          this.total = page.total;
          this.articlelist = page.items;
        }
      });
    },
  },
};
</script>
<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}

.article-content {
  /* 其他样式 */
  /* 限制文章内容宽度为一行 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  width: 100%;
}
</style>
