<template >
  <div class="container">
    <Header2></Header2>
    <div style="padding-bottom: 20px"></div>
    <el-main>
      <el-col :xs="17" :sm="17" :md="17" :lg="17" :xl="17">
        <div>
          <div v-for="article in articles" :key="article.id">
            <el-card style="text-align: left">
              <!-- 头像，名字，创建时间信息 -->
              <h5>
                <span style="display: inline-block; vertical-align: middle"
                  ><el-avatar
                    size="100"
                    :fit="fill"
                    :src="article.creator_avatar"
                  ></el-avatar
                ></span>
                <span style="display: inline-block; vertical-align: middle"
                  >{{ article.creator_name }} | {{ article.gmtCreate }}</span
                >
              </h5>

              <h4>
                <router-link
                  :to="{
                    name: 'ArticleDetail',
                    params: { articleId: article.id },
                  }"
                >
                  {{ article.title }}
                </router-link>
              </h4>
              <p>{{ article.description | limitText }}</p>

              <i class="el-icon-view" style="margin-right: 10px">{{
                article.viewCount
              }}</i>
              <i class="el-icon-chat-dot-square">{{ article.commentCount }}</i>
            </el-card>
          </div>
          <div style="padding-bottom: 10px"></div>

          <el-pagination
            class="mpage"
            background
            layout="prev, pager, next"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @current-change="page"
            >>
          </el-pagination>
        </div>
      </el-col>

      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :push="1">
        <div class="right">
          <!-- 轮播图 -->
          <div>
            <el-carousel indicator-position="none">
              <el-carousel-item v-for="item in 4" :key="item" class="carousel">
                <h3>{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </div>
          <!-- 热门文章 -->
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
                <el-list
                  :loading="loading"
                  :empty-text="emptyText"
                  :border="false"
                >
                  <el-list-item
                    v-for="(article, index) in hotArticles"
                    :key="article.id"
                    :index="index"
                  >
                    <div class="article-info">
                      <router-link
                        :to="{
                          name: 'ArticleDetail',
                          params: { articleId: article.id },
                        }"
                        >{{ article.title }}</router-link
                      >
                      <span class="article-time">{{ article.createTime }}</span>
                    </div>
                  </el-list-item>
                </el-list>
              </div>
            </el-card>
          </div>
        </div>
      </el-col>
    </el-main>
    <!-- <div class="container-footer">
      <Footer></Footer>
    </div> -->

    <!-- 回到顶部 -->
    <el-backtop title="回到顶部" :bottom="220"></el-backtop>
  </div>
</template>

<script>
import Header2 from "../components/Header2";
import Footer from "../components/Footer";
export default {
  name: "Article.vue",
  components: { Header2, Footer },
  data() {
    return {
      articles: {},
      currentPage: 1,
      total: 0,
      pageSize: "",

      hotArticles: {},
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
    page(currentPage) {
      const _this = this;
      _this.$axios
        .get("/article/articleList?currentPage=" + currentPage)
        .then((res) => {
          console.log(res);
          _this.articles = res.data.data.articleRecords;
          _this.currentPage = res.data.data.currentPage;
          _this.total = res.data.data.total;
          _this.pageSize = res.data.data.pageSize;
          console.log("pageSize----------->", res.data.data.pageSize);
        });
    },

    async getArticles() {
      this.loading = true;
      const count = 12;
      this.$axios
        .get("/article/article/hot", { params: { count } })
        .then((res) => {
          if (res != null) {
            this.hotArticles = res.data.data;
            this.emptyText = "暂无数据";
          } else {
            this.hotArticles = [];
            this.emptyText = "数据加载失败，请重试";
          }
          this.loading = false;
        });
    },
  },
  created() {
    this.page(1);
  },

  filters: {
    limitText: function (value) {
      if (!value) return "";
      if (value.length > 50) {
        return value.slice(0, 50) + "...";
      }
      return value;
    },
  },
};
</script>


<style scoped>
.el-main {
  background-color: #e9eef3;
  color: #333;
  padding-bottom: 60px;
  flex: 1; /* 让 Main 的高度填满容器 */
}
.mpage {
  margin: 0 auto;
  text-align: center;
}
.container {
  min-height: 100vh; /* 设置最小高度为视口高度 */
  display: flex;
  flex-direction: column;
}
.container-footer {
  margin-top: auto; /* 将 Footer 推到容器底部 */
  height: 100%; /* 设置高度为容器高度 */
  display: flex;
  flex-direction: column;
}

/* 走马灯 */
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 230px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.carousel {
  height: 230px;
}
</style>