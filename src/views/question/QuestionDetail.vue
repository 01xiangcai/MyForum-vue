<template>
  <div id="app">
    <div class="container">
      <Header2></Header2>
      <div style="padding-bottom: 20px"></div>

      <el-col :xs="17" :sm="17" :md="17" :lg="17" :xl="17" :push="1">
        <div class="questionDetail">
          <h2>{{ question.title }}</h2>
          <el-link icon="el-icon-edit" v-if="ownBlog">
            <router-link
              :to="{
                name: 'QuestionEdit',
                params: { questionId: question.id },
              }"
            >
              编辑
            </router-link>
          </el-link>
          <el-divider></el-divider>
          <div class="markdown-body" v-html="question.description"></div>

          <el-divider></el-divider>
          <div>
            <h3>评论</h3>
            <div style="display: flex; flex-direction: column">
              <span style="margin-bottom: 10px"
                ><el-avatar
                  shape="circle"
                  :size="60"
                  :fit="fill"
                  :src="currentUser.avatar"
                  style="display: inline-block; vertical-align: middle"
                ></el-avatar
                >{{ currentUser.username }}
              </span>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2 }"
                placeholder="请输入内容"
                v-model="comments"
                style="margin-bottom: 20px"
              >
              </el-input>
              <div style="display: flex; justify-content: flex-end">
                <el-button type="primary" round @click="submitComment(comments)"
                  >发表评论</el-button
                >
              </div>
            </div>
            <el-divider></el-divider>

            <div>
              <h3>热门评论</h3>
              <div v-for="comment in getcomments" :key="comment.id">
                <div>
                  <el-avatar
                    shape="circle"
                    :size="30"
                    :fit="fill"
                    :src="comment.avatar"
                    style="display: inline-block; vertical-align: middle"
                  ></el-avatar>
                  <span style="display: inline-block; vertical-align: middle"
                    >{{ comment.username }}
                  </span>
                  <spqn class="gmtCreate">{{ comment.gmtCreate }}</spqn>
                  <p>{{ comment.content }}</p>

                  <i class="el-icon-sugar" style="margin-right: 10px">{{
                    comment.likeCount
                  }}</i>

                  <i class="el-icon-chat-dot-square">{{
                    comment.commentCount
                  }}</i>
                </div>
                <el-divider></el-divider>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :push="2">
        <div>
          <div class="right">
            <el-avatar
              shape="square"
              :size="100"
              :fit="fill"
              :src="user.avatar"
              style="display: inline-block; vertical-align: middle"
            ></el-avatar>
            <span style="display: inline-block; vertical-align: middle"
              >作者：{{ user.username }}
            </span>
            <p>
              <el-button type="primary" plain>关注</el-button>
              <el-button plain>私信</el-button>
            </p>
          </div>
        </div>
      </el-col>
    </div>
    <!-- 回到顶部 -->
    <el-backtop title="回到顶部" :bottom="220"></el-backtop>
  </div>
</template>

<script>
import "github-markdown-css";
import Header2 from "@/components/Header2";

export default {
  name: "QuestionDetail.vue",
  components: { Header2 },
  data() {
    return {
      question: {
        id: "",
        title: "",
        description: "",
        creator: "",
      },
      user: {
        id: "",
        username: "",
        avatar: "",
      },
      currentUser: {
        avatar: "",
        username: "",
      },
      comment: {
        parentId: "",
        type: "",
        commentator: "",
        content: "",
      },
      getcomments: {},

      //   评论输入框信息
      comments: "",
      ownBlog: false,
      visible: false,
    };
  },
  methods: {
    submitComment(contents) {
      const _this = this;
      _this.comment.type = 1;
      _this.comment.content = contents;
      _this.comment.commentator = _this.$store.getters.getUser.id;
      this.$axios
        .post("/comment/insertComment", this.comment, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.showComments(this.question.id);

          _this.$message({
                showClose: true,
                message: res.data.msg,
                type: "success",
              });
          this.comments = "";
        });
    },

    showComments(parentId) {
      const _this = this;
      const type = 1;
      this.$axios
        .get("/comment/commentList", { params: { parentId, type } })
        .then((res) => {
          _this.getcomments = res.data.data;
        });
    },

    increaseView(id) {
      const _this = this;
      console.log("增加阅读数id----------------------------", id);
      _this.$axios
        .get("/question/increaseView", { params: { id } })
        .then((res) => {
          console.log(res);
        });
    },
  },

  created() {
    const questionId = this.$route.params.questionId;
    const parentId = questionId;
    const _this = this;
    this.$axios
      .get("/question/question/" + questionId)
      .then((res) => {
        const question = res.data.data;
        _this.question.id = question.id;
        _this.question.title = question.title;
        _this.comment.parentId = question.id;
        this.increaseView(question.id);

        var MardownIt = require("markdown-it");
        var md = new MardownIt();

        var result = md.render(question.description);
        _this.question.description = result;
        _this.ownBlog = question.creator === _this.$store.getters.getUser.id;
        _this.currentUser.avatar = _this.$store.getters.getUser.avatar;
        _this.currentUser.username = _this.$store.getters.getUser.username;
        return this.$axios.get("/user/" + question.creator);
      })
      .then((res) => {
        const user = res.data.data;
        _this.user.avatar = user.avatar;
        _this.user.id = user.id;
        _this.user.username = user.username;
      })
      .catch((error) => {
        _this.$alert("查询失败", "提示", {
          confirmButtonText: "确定",
        });
      });

    this.showComments(parentId);
  },
};
</script>

<style scoped>
#app {
  height: 100%;
}
.questionDetail {
  width: 100%;
  min-height: 700px;
  padding: 20px 15px;
  text-align: left;
  background: #f3f4f9ea;
}
.container {
  /* height: 100vh; */
  overflow-x: hidden;
  background: #e4e6eb;
}

.el-card-define {
  min-height: 100%;
  height: 100%;
}
.el-card-define >>> .el-card__body {
  height: 100%;
  text-align: left;
}
.right {
  background: #f3f4f9ea;
  width: 260px;
  height: 160px;
}

.markdown-body {
  background: #f3f4f9ea;
}

.submit {
  /* float: right; */
  margin-top: 10px;
}

.gmtCreate {
  float: right;
  font-size: 12px;
  padding-top: 8px;
}
</style>