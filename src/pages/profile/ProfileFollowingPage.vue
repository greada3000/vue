<template>
  <div class="about">
    <el-scrollbar style="height: 75%">
      <!-- <span>wode搜索主页</span> -->
      <!-- <span>{{$route.params.id}}</span> -->
      <el-col :span="15" :offset="2">
        <el-card>
          <div v-for="(item, i) in concernlist" :key="i">
            <el-card>
              <template #header>
                <div class="clearfix">
                  <el-row :gutter="6">
                    <el-col :span="7">
                      <h3>
                        <router-link target="_blank" :to="'/users/' + item.userId">{{ item.username }}</router-link>
                      </h3>
                    </el-col>
                    <el-col :span="3">
                      <el-button type="danger" @click="quxiaoguanzhu(item.userId)" v-if="isis">取消关注</el-button>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </el-card>
          </div>
        </el-card>
      </el-col>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: "ProfileFollowingPage",
  data() {
    return {
      concernlist: [],
      isis: 0,
    };
  },
  created() {
    (this.getconcern(), this.getis());
  },
  methods: {
    getconcern() {
      this.$api.follows.following(this.$route.params.id).then((resp) => {
        let data = resp.data;
        if (data.success) {
          this.concernlist = data.data;
        }
      });
    },
    quxiaoguanzhu(id) {
      let prelast = {
        preuser: this.$store.getters.getUser.name,
        lastuser: id,
      };
      this.$api.follows.remove(prelast.preuser, prelast.lastuser).then((resp) => {
        let data = resp.data;
        if (data.success) {
          this.getconcern();
        }
      });
    },
    getis() {
      if (this.$store.getters.getUser.name == this.$route.params.id) {
        this.isis = 1;
      }
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
