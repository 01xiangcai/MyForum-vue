<template>
  <div>
    <Header2></Header2>
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
        <el-menu-item index="/notifications/replies">回复</el-menu-item>
        <el-menu-item index="/notifications/messages">私信</el-menu-item>
        <el-menu-item index="/notifications/system">系统通知</el-menu-item>
      </el-menu>
    </div>
    <el-tabs v-model="tabIndex" style="margin-top: 20px">
      <el-tab-pane label="未读">
        <div v-for="notification in notifications" :key="notification.id">
          <el-card style="text-align: left">
            {{ notification.notifierName }}回复了你的{{ notification.typeName }}

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
              circle
              @click="markread(index)"
            ></el-button>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已读">
        <div
          v-for="(notification, index) in readNotifications"
          :key="index"
          style="margin-top: 20px"
        >
          <el-alert
            :closable="false"
            :title="notification.title"
            :type="notification.type"
            :description="notification.description"
            show-icon
          >
            <span slot="footer" @click="markUnread(index)">标记未读</span>
          </el-alert>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Header2 from "@/components/Header2";
export default {
  components: { Header2 },
  data() {
    return {
      tabIndex: 0,
      notifications: [
        {
          type: "success",
          title: "回复通知",
          description: "你的文章《xxx》有新的回复。",
          read: false,
        },
        {
          type: "warning",
          title: "私信通知",
          description: "你收到了一封新的私信。",
          read: false,
        },
        {
          type: "info",
          title: "系统通知",
          description: "系统正在进行维护，可能会影响您的使用。",
          read: true,
        },
      ],
    };
  },
  computed: {
    unreadNotifications() {
      return this.notifications.filter((notification) => !notification.read);
    },
    readNotifications() {
      return this.notifications.filter((notification) => notification.read);
    },
  },
  methods: {
    markRead(index) {
      this.notifications[index].read = true;
    },
    markUnread(index) {
      this.notifications[index].read = false;
    },
  },
};
</script>



<style scoped>
.notifications-menu {
  height: calc(50% - 20px); /* adjust the height as per your needs */
}
</style>
