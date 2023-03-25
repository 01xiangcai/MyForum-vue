<template>
  <el-header>
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
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

      <el-menu-item index="4" disabled>消息中心</el-menu-item>
      <el-menu-item index="/login" v-show="!hasLogin">{{
        user.username
      }}</el-menu-item>

      <el-submenu index="6" v-show="hasLogin">
        <template slot="title">发布</template>
        <el-menu-item index="/article/add">发布文章</el-menu-item>
        <el-menu-item index="/question/add">发布问题</el-menu-item>
      </el-submenu>

      <el-submenu index="5" v-show="hasLogin">
        <template slot="title">{{ user.username }}</template>
        <el-menu-item index="2-1">个人资料</el-menu-item>
        <el-menu-item index="2-2">我的文章</el-menu-item>
        <el-menu-item index="2-3" @click="logout">退出登录 </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-header>
</template>


<script>
export default {
  name: "Header2",
  data() {
    return {
      user: {
        username: "请先登录",
      },
      hasLogin: false,
      activeIndex: "",
    };
  },

//   watch: {
//     $router() {
//       this.handleSelect(this.activeIndex);
//     },
//   },

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
    // handleSelect(index) {
    //   this.activeIndex = index;
    // },
  },

  created() {
    if (this.$store.getters.getUser.username) {
      this.user.username = this.$store.getters.getUser.username;
      this.hasLogin = true;
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
</style>