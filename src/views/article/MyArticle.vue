<template >
  <div class="container">
    <Header2></Header2>
    <div style="padding-bottom: 20px"></div>
    <el-main>
      <el-col :xs="17" :sm="17" :md="17" :lg="17" :xl="17">
        <div>
          <div v-for="article in articles" :key="article.id">
            <el-card style="text-align: left">
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
              <i class="el-icon-chat-dot-square" style="margin-right: 10px">{{
                article.commentCount
              }}</i>
              时间:{{ article.gmtCreate }}
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
          >
          </el-pagination>
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
import Header2 from "@/components/Header2";

export default {
  name: "MyQuestion.vue",
  components: { Header2 },
  data() {
    return {
      articles: {},
      currentPage: 1,
      total: 0,
      pageSize: 5,
    };
  },

  methods: {
    page(currentPage, pageSize) {
      const _this = this;
      const userId = _this.$store.getters.getUser.id;
      _this.$axios
        .get("/article//articleByUserId", {
          params: { userId, currentPage, pageSize },
        })
        .then((res) => {
          _this.articles = res.data.data.records;

          _this.currentPage = res.data.data.current;
          _this.total = res.data.data.total;
          _this.pageSize = res.data.data.size;
        });
    },
  },

  created() {
    this.page(1, 5);
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

.right {
  width: 350px;
  height: 230px;
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