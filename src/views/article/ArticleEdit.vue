<template>
  <div>
    <Header2></Header2>

    <div style="padding-bottom: 20px"></div>

    <div class="m-content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="description">
          <mavon-editor
            v-model="ruleForm.description"
            @imgAdd="$imgAdd"
            @imgDel="$imgDel"
          ></mavon-editor>
        </el-form-item>
        <el-button @click="uploadimgs()">统一上传图片</el-button>

        <!-- <el-form-item label="标签" prop="tag">
          <el-input v-model="ruleForm.tag"></el-input>
        </el-form-item> -->
        <el-form-item prop="tag">
          <el-select
            v-model="ruleForm.tag"
            clearable
            placeholder="选择标签"
            style="float: left"
          >
            <el-option
              v-for="tag in tags"
              :key="tag.id"
              :label="tag.tagName"
              :value="tag.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
import Header2 from "@/components/Header2";
export default {
  name: "ArticleEdit.vue",
  components: { Header2 },
  data() {
    return {
      ruleForm: {
        id: "",
        title: "",
        description: "",
        tag: "",
        creator: "",
      },
      //标签
      tags: {},

      img_file: {},

      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 3,
            max: 25,
            message: "长度在 3 到 25 个字符",
            trigger: "blur",
          },
        ],
        description: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        tag: [{ required: true, message: "请输入标签", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this;
          _this.ruleForm.creator = _this.$store.getters.getUser.id;
          this.$axios
            .post("/article/saveOrUpdate", this.ruleForm, {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            })
            .then((res) => {
              console.log(res);
              _this.$message({
                showClose: true,
                message: res.data.msg,
                type: "success",
              });
              _this.$router.push("/article");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getTags() {
      this.$axios.get("/article-tag/getArticleTag").then((res) => {
        this.tags = res.data.data;
      });
    },

    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      // 缓存图片信息
      this.img_file[pos] = $file;
    },
    $imgDel(pos) {
      // 从 imgFiles 中删除指定位置的图片
      delete this.img_file[pos];
    },

    uploadimgs($e) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      console.log("zhixingsadjmkaskdjkalsjdlkasjdas");
      for (var _img in this.img_file) {
        formdata.append(_img, this.img_file[_img]);
      }

      this.$axios
        .post("/upload/qiniuImages", formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          for (var img in res) {
            // $vm.$img2Url 详情见本页末尾
            $vm.$img2Url(img[0], img[1]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  created() {
    const articleId = this.$route.params.articleId;
    console.log(articleId);
    const _this = this;
    if (articleId) {
      this.$axios.get("/article/articleById/" + articleId).then((res) => {
        const article = res.data.data;
        _this.ruleForm.id = article.id;
        _this.ruleForm.title = article.title;
        _this.ruleForm.description = article.description;
        _this.ruleForm.tag = article.tag;
      });
    }
    _this.getTags();
  },
};
</script>

<style scoped>
.m-content {
  text-align: center;
}
</style>