<template>
  <div class="mcontaner">
    <Header2></Header2>
    <div style="padding-bottom: 20px"></div>

<!-- 主体部分 -->
    <div class="block">
      <el-timeline>
        <el-timeline-item
          style="text-align: left"
          :timestamp="blog.created"
          placement="top"
          v-for="blog in blogs"
          :key="blog.id"
        >
          <el-card style="text-align: left">
            <h4>
              <router-link
                :to="{ name: 'BlogDetail', params: { blogId: blog.id } }"
              >
                {{ blog.title }}
              </router-link>
            </h4>
            <p>{{ blog.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>

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



    <!-- <div class="container-footer">
      <Footer></Footer>
    </div> -->
    <!-- 回到顶部 -->
    <el-backtop title="回到顶部" :bottom="220"></el-backtop>
  </div>
</template>

<script>
import Header from "../components/Header";
import Header2 from "../components/Header2";
import Footer from "../components/Footer";

export default {
  name: "Blogs.vue",
  components: { Header2, Footer },
  data() {
    return {
      blogs: {},
      currentPage: 1,
      total: 0,
      pageSize: 5,
    };
  },
  methods: {
    page(currentPage) {
      const _this = this;
      _this.$axios.get("/blog/blogs?currentPage=" + currentPage).then((res) => {
        console.log(res);
        _this.blogs = res.data.data.records;
        _this.currentPage = res.data.data.current;
        _this.total = res.data.data.total;
        _this.pageSize = res.data.data.size;
      });
    },
  },
  created() {
    this.page(1);
  },
};
</script>

<style scoped>
.mcontaner {
  min-height: 100vh; /* 设置最小高度为视口高度 */
  display: flex;
  flex-direction: column;
}
.mpage {
  margin: 0 auto;
  text-align: center;
}
.block {
  margin-bottom: 60px;
}
.container-footer {
  margin-top: auto; /* 将 Footer 推到容器底部 */
  height: 100%; /* 设置高度为容器高度 */
  display: flex;
  flex-direction: column;
}
</style>