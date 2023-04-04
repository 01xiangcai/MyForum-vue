<template >
  <div class="container">
    <Header2></Header2>
    <div style="padding-bottom: 20px"></div>
    <el-main>
      <el-col :xs="17" :sm="17" :md="17" :lg="17" :xl="17">
        <div>
          <div v-for="question in questions" :key="question.id">
            <el-card style="text-align: left">
              <h5>
                <span style="display: inline-block; vertical-align: middle"
                  ><el-avatar
                    size="100"
                    :fit="fill"
                    :src="question.creator_avatar"
                  ></el-avatar
                ></span>
                <span style="display: inline-block; vertical-align: middle"
                  >{{ question.creator_name }} | {{ question.gmtCreate }}</span
                >
              </h5>
              <h4>
                <router-link
                  :to="{
                    name: 'QuestionDetail',
                    params: { questionId: question.id },
                  }"
                >
                  {{ question.title }}
                </router-link>
              </h4>
              <p>{{ question.description | limitText }}</p>
              <i class="el-icon-view" style="margin-right: 10px">{{
                question.viewCount
              }}</i>
              <i class="el-icon-chat-dot-square">{{ question.commentCount }}</i>
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

      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :push="1">
        <div class="right">
          <div>
            <el-carousel indicator-position="none">
              <el-carousel-item
                v-for="carouselurl in carouselList"
                :key="carouselurl.id"
                class="carousel"
              >
                <img
                  :src="carouselurl.url"
                  :alt="Image"
                  style="
                    width: 100%;
                    height: 100%;
                    object-fit: fill;
                    object-position: center;
                  "
                />
              </el-carousel-item>
            </el-carousel>
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
  name: "Questions.vue",
  components: { Header2, Footer },
  data() {
    return {
      questions: {},
      currentPage: 1,

      carouselList: {},

      total: 0,
      pageSize: 5,
    };
  },

  methods: {
    page(currentPage) {
      const _this = this;
      _this.$axios
        .get("/question/questions?currentPage=" + currentPage)
        .then((res) => {
          _this.questions = res.data.data.questionRecords;

          _this.currentPage = res.data.data.currentPage;
          _this.total = res.data.data.total;
          _this.pageSize = res.data.data.pageSize;
        });
    },

    // 轮播图
    getCarousel(type) {
      this.$axios
        .get("/carousel/getCarousel", { params: { type } })
        .then((res) => {
          this.carouselList = res.data.data;
         
        });
    },
  },

  created() {
    this.page(1);
    this.getCarousel(2);
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

/* 右边盒子加了大小，当屏幕较小时会有横向滚动条 */
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