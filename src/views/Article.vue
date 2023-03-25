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
                <!-- <router-link
                  :to="{ name: 'BlogDetail', params: { blogId: blog.id } }"
                > -->
                {{ article.title }}
                <!-- </router-link> -->
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
        <div id="left">3</div>
      </el-col>
    </el-main>
    <div class="container-footer">
      <Footer></Footer>
    </div>
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
      pageSize: 5,
    };
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
</style>