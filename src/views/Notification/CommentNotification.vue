

<template>
  <div class="container">
    <Header2></Header2>
    <div style="padding-bottom: 20px"></div>

    <el-main>
      <div v-for="notification in notifications" :key="notification.id">
        <el-card style="text-align: left">
          {{ notification.notifierName }}回复了你的{{ notification.typeName }}
          {{ notification.outerName }} ||时间{{ notification.created }}
        </el-card>
      </div>
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
    </el-main>
  </div>
</template>


<script>
import Header2 from "@/components/Header2";
export default {
  name: "CommentNotification.vue",
  components: { Header2 },

  data() {
    return {
      notifications: {},
      currentPage: 1,
      total: 0,
      pageSize: 5,
    };
  },

  methods: {
    unreadNotification(currentPage, pageSize) {
      const _this = this;
      //   当前用户id
      const id = _this.$store.getters.getUser.id;
      const readType = 0;
      _this.$axios
        .get("/notifition/getNotifitionViews", {
          params: { currentPage, pageSize, id, readType },
        })
        .then((res) => {
          _this.notifications = res.data.data.records;
          _this.currentPage = res.data.data.current;
          _this.total = res.data.data.total;
          _this.pageSize = res.data.data.size;
        });
    },
  },

  created() {
    this.unreadNotification(1, 12);
  },
};
</script>


<style scoped>
.container {
  min-height: 100vh; /* 设置最小高度为视口高度 */
  display: flex;
  flex-direction: column;
}
</style>


