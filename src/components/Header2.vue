<template>
  <!-- <el-header> -->
  <div style="display: flex">
    <el-menu
      :default-active="$route.path"
      class="el-menu"
      mode="horizontal"
      background-color="#d0c7db"
      text-color="#fff"
      active-text-color="#409EFF"
      id="menu"
      :router="true"
    >
      <el-menu-item index="/blogs">哈哈社区</el-menu-item>
      <el-menu-item index="/article">文章</el-menu-item>
      <el-menu-item index="/questions">问答</el-menu-item>

      <el-submenu index="6" v-show="hasLogin">
        <template slot="title">发布</template>
        <el-menu-item index="/article/add">发布文章</el-menu-item>
        <el-menu-item index="/question/add">发布问题</el-menu-item>
      </el-submenu>

      <el-menu-item index="/myTest">测试页面</el-menu-item>

      <!-- 用户是否登录，用户信息 -->
      <el-menu-item index="/login" v-show="!hasLogin" style="float: right">{{
        user.username
      }}</el-menu-item>
      <el-submenu index="5" v-show="hasLogin" style="float: right">
        <template slot="title"
          ><el-avatar :src="user.avatar" :fit="fill"></el-avatar
          >{{ user.username }}</template
        >
        <!-- <template slot="title">{{ user.username }}</template> -->
        <!-- <el-menu-item>
          <router-link
            :to="{
              name: 'UserById',
              params: { userId: currentuserId },
            }"
          >
            个人资料
          </router-link>
        </el-menu-item> -->
        <el-menu-item :index="`/user/${currentuserId}`">个人资料</el-menu-item>
        <el-menu-item index="/myArticles">我的文章</el-menu-item>
        <el-menu-item index="/myQuestions">我的问题</el-menu-item>
        <el-menu-item index="2-3" @click="logout">退出登录 </el-menu-item>
      </el-submenu>

      <!-- 通知按钮 -->
      <el-submenu index="7" style="float: right">
        <template slot="title">
          <i class="el-icon-message-solid" style="position: relative"
            ><el-badge
              v-if="notificationUnreadCount != 0"
              :value="notificationUnreadCount"
              :max="99"
              class="item"
              style="position: absolute; top: -20px"
            ></el-badge
          ></i>
        </template>

        <el-menu-item index="/commentNotification"
          >回复<el-badge
            v-if="notificationUnreadCount != 0"
            :value="notificationUnreadCount"
            :max="99"
            class="item"
            style="position: absolute; top: -20px"
          ></el-badge
        ></el-menu-item>
        <el-menu-item index=""
          >私信<el-badge
            :value="0"
            :max="99"
            class="item"
            style="position: absolute; top: -20px"
            hidden="true"
          ></el-badge
        ></el-menu-item>
        <el-menu-item index=""
          >通知<el-badge
            :value="0"
            :max="99"
            class="item"
            style="position: absolute; top: -20px"
            hidden="true"
          ></el-badge
        ></el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
  <!-- </el-header> -->
</template>


<script>
export default {
  name: "Header2",
  data() {
    return {
      user: {
        username: "请先登录",
        avatar: "",
      },
      hasLogin: false,
      activeIndex: "",
      currentuserId: "",
      notification: "",
      notificationUnreadCount: "",
    };
  },

  mounted() {
    // 在组件加载完成后连接 WebSocket
    const userId = this.currentuserId;
    const ws = new WebSocket(
      `ws://localhost:8888/notification??userId=${userId}`
    );
    ws.onopen = () => {
      console.log("WebSocket 连接成功");
    };
    ws.onmessage = (event) => {
      // 接收到消息时去更新消息数量
      this.NotificationUnreadCount();
      this.notification = JSON.parse(event.data);
      if (this.currentuserId === this.notification.receiver) {
        this.$message({
          showClose: true,
          duration: 3000,
          message:
            this.notification.notifierName +
            "回复了你的" +
            this.notification.typeName +
            this.notification.outerName,
        });
      }

      console.log("event--------------->", event);
      console.log("notification--------------->", this.notification);
    };
    ws.onclose = () => {
      console.log("WebSocket 连接关闭");
    };
    ws.onerror = (error) => {
      console.log("WebSocket 连接错误", error);
    };
  },

  methods: {
    logout() {
      const _this = this;
      _this.$axios
        .get("/logout", {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          _this.$store.commit("REMOVE_INFO");
          _this.$router.push("/login");
        });
    },

    NotificationUnreadCount() {
      const _this = this;
      const userId = _this.currentuserId;
      const readType = 0;

      console.log(userId, readType);
      _this.$axios
        .get("/notifition/getNotificationCountById", {
          params: { userId, readType },
        })
        .then((res) => {
          _this.notificationUnreadCount = res.data.data;
          console.log(
            "notificationUnreadCount----->",
            _this.notificationUnreadCount
          );
        });
    },
  },

  created() {
    if (this.$store.getters.getUser.username) {
      this.user.username = this.$store.getters.getUser.username;
      this.user.avatar = this.$store.getters.getUser.avatar;
      this.currentuserId = this.$store.getters.getUser.id;

      this.hasLogin = true;
    }
    // 当用户登录的时候再去加载通知消息
    if (this.$store.getters.getUser.username) {
      this.NotificationUnreadCount();
    }
  },
};
</script>





<style scoped>
.el-header {
  /* background-color: #545c64; */
  background-color: #d0c7db;

  /* color: #333; */
  /* line-height: 60px; */
}
.el-menu {
  width: 100%;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>