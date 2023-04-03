<template>
  <div class="article-ranking">
    <el-card class="ranking-card">
      <div slot="header" class="clearfix">
        <span>热门文章排行</span>
        <div class="ranking-select">
          <el-select
            v-model="rankingType"
            placeholder="请选择排行方式"
            @change="getArticles"
          >
            <el-option label="最热" value="hot"></el-option>
            <el-option label="观看" value="view"></el-option>
            <el-option label="最新" value="new"></el-option>
          </el-select>
        </div>
      </div>
      <div class="article-list">
        <el-list :loading="loading" :empty-text="emptyText" :border="false">
          <el-list-item
            v-for="(article, index) in articles"
            :key="article.id"
            :index="index"
          >
            <div class="article-info">
              <router-link :to="{ path: '/article/' + article.id }">{{
                article.title
              }}</router-link>
              <span class="article-time">{{ article.createTime }}</span>
            </div>
           
          </el-list-item>
        </el-list>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "MyTestIndex",
  data() {
    return {
      articles: {},
      count: "",
      rankingType: "",
      loading: false,
      emptyText: "暂无数据",
    };
  },
  mounted() {
    this.getArticles();
  },
  methods: {
    async getArticles() {
      this.loading = true;
      const count = 5;
      this.$axios
        .get("/article/article/hot", { params: { count } })
        .then((res) => {
          if (res != null) {
            this.articles = res.data.data;
            this.emptyText = "暂无数据";
          } else {
            this.articles = [];
            this.emptyText = "数据加载失败，请重试";
          }
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.article-ranking {
  margin-bottom: 30px;
}
.ranking-card {
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.ranking-select {
  float: right;
}
.article-list {
  margin-top: 10px;
}
.article-info {
  display: inline-block;
  width: calc(100% - 60px);
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.article-time {
  margin-left: 10px;
  color: #909399;
}
.article-rank {
  float: right;
  font-size: 14px;
  color: #909399;
}
</style>
