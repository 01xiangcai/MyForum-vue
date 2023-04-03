<template>
  <div class="container">
    <Header2></Header2>
    <!-- 消息导航 -->
    <div>
      <el-menu
        :default-active="$route.path"
        class="el-menu"
        mode="horizontal"
        text-color="rgb(60 173 207)"
        active-text-color="#409EFF"
        id="menu"
        :router="true"
      >
        <el-menu-item index="/commentNotification">回复</el-menu-item>
        <el-menu-item index="/notifications/messages">私信</el-menu-item>
        <el-menu-item index="/notifications/system">系统通知</el-menu-item>
      </el-menu>
    </div>

    <!-- 消息未读或已读 -->
    <el-main>
      <el-tabs style="margin-top: 20px" v-model="activeTab">
        <el-tab-pane label="未读" @tab-click="unreadNotification(1, 10)">
          <p style="text-align: left">
            未读
            <el-badge :value="unreadTotal" class="item"></el-badge>
          </p>
          <div v-for="notification in notifications" :key="notification.id">
            <el-card style="text-align: left">
              {{ notification.notifierName }}回复了你的{{
                notification.typeName
              }}
              <!-- 跳转文章详情 -->
              <router-link
                :to="{
                  name: 'ArticleDetail',
                  params: { articleId: notification.outerid },
                }"
                v-show="notification.typeName == '文章'"
              >
                {{ notification.outerName }}
              </router-link>
              <!-- 跳转问题详情 -->
              <router-link
                :to="{
                  name: 'QuestionDetail',
                  params: { questionId: notification.outerid },
                }"
                v-show="notification.typeName == '问题'"
              >
                {{ notification.outerName }}
              </router-link>
              ||时间{{ notification.created }}
              <el-button
                type="success"
                icon="el-icon-check"
                size="mini"
                title="标记已读"
                circle
                @click="markRead(notification.id)"
                style="float: right"
              ></el-button>
            </el-card>
          </div>
          <!-- 分页组件 -->
          <el-pagination
            class="mpage"
            background
            layout="prev, pager, next"
            :current-page="unreadCurrentPage"
            :page-size="unreadPageSize"
            :total="unreadTotal"
            @current-change="unreadNotification"
          >
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="已读" @tab-click="readNotification(1, 10)">
          <p style="text-align: left">
            已读
            <el-badge :value="readedTotal" class="item" type="primary"></el-badge>
          </p>
          <div
            v-for="readNotification in readNotifications"
            :key="readNotification.id"
          >
            <el-card style="text-align: left">
              {{ readNotification.notifierName }}回复了你的{{
                readNotification.typeName
              }}
              <!-- 跳转文章详情 -->
              <router-link
                :to="{
                  name: 'ArticleDetail',
                  params: { articleId: readNotification.outerid },
                }"
                v-show="readNotification.typeName == '文章'"
              >
                {{ readNotification.outerName }}
              </router-link>
              <!-- 跳转问题详情 -->
              <router-link
                :to="{
                  name: 'QuestionDetail',
                  params: { questionId: readNotification.outerid },
                }"
                v-show="readNotification.typeName == '问题'"
              >
                {{ readNotification.outerName }}
              </router-link>
              ||时间{{ readNotification.created }}
            </el-card>
          </div>
          <!-- 分页组件 -->
          <el-pagination
            class="mpage"
            background
            layout="prev, pager, next"
            :current-page="readedCurrentPage"
            :page-size="readedPageSize"
            :total="readedTotal"
            @current-change="readNotification"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
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
      readNotifications: {},

      unreadCurrentPage: 1,
      unreadTotal: 0,
      unreadPageSize: 10,

      readedCurrentPage: 1,
      readedTotal: 0,
      readedPageSize: 10,

      activeTab: 0,
    };
  },

  methods: {
    unreadNotification(unreadCurrentPage, unreadPageSize) {
      const _this = this;
      //   当前用户id
      const id = _this.$store.getters.getUser.id;
      const readType = 0;
      const currentPage = unreadCurrentPage;
      const pageSize = unreadPageSize;
      console.log("unread1111----------->", unreadCurrentPage, unreadPageSize);
      _this.$axios
        .get("/notifition/getNotifitionViews", {
          params: { currentPage, pageSize, id, readType },
        })
        .then((res) => {
          _this.notifications = res.data.data.notificationVoRecords;
          console.log("notifications-------------->", _this.notifications);
          _this.unreadCurrentPage = res.data.data.currentPage;
          _this.unreadTotal = res.data.data.total;
          _this.unreadPageSize = res.data.data.pageSize;
          console.log(
            "unread----------->",
            unreadCurrentPage,
            _this.unreadTotal,
            _this.unreadPageSize
          );
        });
    },

    readNotification(readedCurrentPage, readedPageSize) {
      const _this = this;
      //   当前用户id
      const id = _this.$store.getters.getUser.id;
      const readType = 1;
      const currentPage = readedCurrentPage;
      const pageSize = readedPageSize;
      _this.$axios
        .get("/notifition/getNotifitionViews", {
          params: { currentPage, pageSize, id, readType },
        })
        .then((res) => {
          _this.readNotifications = res.data.data.notificationVoRecords;
          console.log(
            "readNotifications-------------->",
            _this.readNotifications
          );
          _this.readedCurrentPage = res.data.data.currentPage;
          _this.readedTotal = res.data.data.total;
          _this.readedPageSize = res.data.data.pageSize;
          console.log(
            "readed----------->",
            readedCurrentPage,
            _this.readedTotal,
            _this.readedPageSize
          );
        });
    },

    markRead(id) {
      const _this = this;
      console.log("id---------->", id);
      _this.$axios
        .get("/notifition//markRead", { params: { id } })
        .then((res) => {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "success",
          });
          this.unreadNotification(this.readedCurrentPage, this.readedPageSize);
        });
    },
  },

  mounted() {
    this.readNotification(this.unreadCurrentPage, this.unreadPageSize);
    this.unreadNotification(this.readedCurrentPage, this.readedPageSize);
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


