<template>
  <div>
    <Header2></Header2>

    <div style="padding-bottom: 20px"></div>

    <div class="m-content">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="description">
          <mavon-editor v-model="ruleForm.description"></mavon-editor>
        </el-form-item>

        <el-form-item label="标签" prop="tag">
          <el-input v-model="ruleForm.tag"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </div>



  </div>
</template>

<script>
  import Header2 from "@/components/Header2";
  export default {
    name: "QuetionEdit.vue",
    components: {Header2},
    data() {
      return {
        ruleForm: {
          id: '',
          title: '',
          description: '',
          tag:''
        },
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入内容', trigger: 'blur' }
          ],
          tag: [
            { required: true, message: '请输入标签', trigger: 'blur' },
          ],
          
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            const _this = this
            this.$axios.post('/question/publish', this.ruleForm, {
              headers: {
                "Authorization": localStorage.getItem("token")
              }
            }).then(res => {
              console.log(res)
              _this.$alert('发布成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push("/questions")
                }
              });

            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
      const questionId = this.$route.params.questionId
      console.log(questionId)
      const _this = this
      if(questionId) {
        this.$axios.get('/question/question/' + questionId).then(res => {
          const question = res.data.data
          _this.ruleForm.id = question.id
          _this.ruleForm.title = question.title
          _this.ruleForm.description = question.description
          _this.ruleForm.tag =question.tag
        })
      }

    }
  }
</script>

<style scoped>
  .m-content {
    text-align: center;
  }
</style>