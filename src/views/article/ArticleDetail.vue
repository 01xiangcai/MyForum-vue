<template>
  <div id="app">
    <div class="container">
      <Header2></Header2>
      <div style="padding-bottom: 20px"></div>

      <el-col :xs="17" :sm="17" :md="17" :lg="17" :xl="17" :push="1">
        <div class="articleDetail">
          <h2>{{ article.title }}</h2>
          <el-link icon="el-icon-edit" v-if="ownBlog">
            <router-link
              :to="{
                name: 'ArticleEdit',
                params: { articleId: article.id },
              }"
            >
              编辑
            </router-link>
          </el-link>
          <el-divider></el-divider>
          <div class="markdown-body" v-html="article.description"></div>

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

                  <i
                    class="el-icon-chat-dot-square"
                    @click="showSubComments(comment.id)"
                    :title="'评论'"
                    style="cursor: pointer"
                    >{{ comment.commentCount }}</i
                  >
                </div>

                <!-- 二级评论列表 -->
                <div
                  v-if="showSub && cuentCommentParentId == comment.id"
                  style="
                    width: 80%;
                    margin-left: 80px;
                    background: rgb(248 243 247);
                  "
                >
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    placeholder="请输入内容"
                    v-model="subInPutComment"
                    style="margin-bottom: 20px"
                  >
                  </el-input>
                  <div style="display: flex; justify-content: flex-end">
                    <el-button
                      type="primary"
                      round
                      @click="submitSubComment(subInPutComment)"
                      >发表评论</el-button
                    >
                  </div>
                  <el-divider></el-divider>
                  <div v-for="subComment in subComments" :key="subComment.id">
                    <div>
                      <el-avatar
                        shape="circle"
                        :size="30"
                        :fit="fill"
                        :src="subComment.avatar"
                        style="display: inline-block; vertical-align: middle"
                      ></el-avatar>
                      <span
                        style="display: inline-block; vertical-align: middle"
                        >{{ subComment.username }}
                      </span>
                      <spqn class="gmtCreate">{{ subComment.gmtCreate }}</spqn>
                      <p>{{ subComment.content }}</p>

                      <i class="el-icon-sugar" style="margin-right: 10px">{{
                        subComment.likeCount
                      }}</i>
                      <hr />
                    </div>
                  </div>
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
      article: {
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
      //发表评论
      comment: {
        parentId: "",
        type: "",
        commentator: "",
        content: "",
      },
      getcomments: {},
      subComments: {},

      //   评论输入框信息
      comments: "",
      subInPutComment: "",
      ownBlog: false,
      visible: false,
      showSub: true,
      cuentCommentParentId: "",
    };
  },
  methods: {
    submitComment(contents) {
      const _this = this;
      _this.comment.type = 1;
      _this.comment.content = contents;
      _this.comment.parentId = _this.article.id;
      if (_this.$store.getters.getUser) {
        _this.comment.commentator = _this.$store.getters.getUser.id;
      }
      this.$axios
        .post("/article-comment/insertComment", this.comment, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.showComments(this.article.id);
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "success",
          });
          this.comments = "";
        })
        .catch((error) => {
          console.log("error------------------->", error);
          this.$message({
            showClose: true,
            message: "请先登录",
            type: "error",
          });
        });
    },

    submitSubComment(contents) {
      const _this = this;
      _this.comment.type = 2;
      _this.comment.content = contents;
      _this.comment.parentId = this.cuentCommentParentId;
      _this.comment.commentator = _this.$store.getters.getUser.id;
      this.$axios
        .post("/article-comment/insertComment", this.comment, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.showSubComments(this.cuentCommentParentId);

          _this.$message({
            showClose: true,
            message: res.data.msg,
            type: "success",
          });
          this.subInPutComment = "";
          _this.comment.parentId = "";
        });
    },

    showComments(parentId) {
      const _this = this;
      const type = 1;
      this.$axios
        .get("/article-comment/commentList", { params: { parentId, type } })
        .then((res) => {
          _this.getcomments = res.data.data;
        });
    },

    increaseView(id) {
      const _this = this;
      _this.$axios
        .get("/article/increaseView", { params: { id } })
        .then((res) => {});
    },

    showSubComments(commentId) {
      const parentId = commentId;
      const type = 2;
      this.cuentCommentParentId = commentId;
      if (this.showSub) {
        this.$axios
          .get("/article-comment/commentList", { params: { parentId, type } })
          .then((res) => {
            this.subComments = res.data.data;
          });
      } else {
        this.showSub = true;
        this.subComments = {};
      }
    },
  },

  created() {
    const articleId = this.$route.params.articleId;
    const parentId = articleId;
    const _this = this;
    this.$axios
      .get("/article/articleById/" + articleId)
      .then((res) => {
        const article = res.data.data;
        _this.article.id = article.id;
        _this.article.title = article.title;
        _this.comment.parentId = article.id;

        this.increaseView(article.id);

        var MardownIt = require("markdown-it");
        var md = new MardownIt();

        var result = md.render(article.description);
        _this.article.description = result;

        // 当用户处于登录状态时再去获取值,不登录时store中不存在user的信息，用_this.$store.getters.getUser.username这种去判断报空指针
        if (_this.$store.getters.getUser) {
          _this.ownBlog = article.creator === _this.$store.getters.getUser.id;
          _this.currentUser.avatar = _this.$store.getters.getUser.avatar;
          _this.currentUser.username = _this.$store.getters.getUser.username;
        }

        return this.$axios.get("/user/" + article.creator);
      })
      .then((res) => {
        const user = res.data.data;
        _this.user.avatar = user.avatar;
        _this.user.id = user.id;
        _this.user.username = user.username;
      })
      .catch((error) => {
        console.log("查询作者没有执行");
      });

    this.showComments(parentId);
  },
};
</script>

<style scoped>
#app {
  height: 100%;
}
.articleDetail {
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

.last-divider {
  margin-bottom: 0;
}
</style>