<template>
  <div>
    <Header2></Header2>
    <div class="userStyle">
      <el-card class="box-card">
        <div class="userContainer">
          <div class="left" style="width: 100px; height: 100px">
            <!-- <el-avatar
              :src="user.avatar"
              :fit="fill"
              style="width: 90%; height: 90%"
            ></el-avatar> -->

            <el-upload
              class="avatar-uploader"
              action="http://localhost:8888/user/uploadAvatar"
              :data="{ userId: user.id }"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-avatar
                v-if="user.avatar"
                :src="user.avatar"
                :fit="fill"
                shape="square"
                style="width: 100%; height: 100%"
              ></el-avatar>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="right">
            <span>用户名字:{{ user.username }} </span>
            <p>用户邮箱:{{ user.email }}</p>

            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="dialogVisible = true"
              >编辑资料</el-button
            >

            <el-dialog
              title="编辑资料"
              :visible.sync="dialogVisible"
              :close-on-click-modal="false"
            >
              <el-form :model="userInfoForm" ref="userInfoForm">
                <el-form-item label="用户名" label-width="80px">
                  <el-input
                    v-model="userInfoForm.username"
                    style="width: 320px"
                  ></el-input
                ></el-form-item>
                <el-form-item label="邮箱" label-width="80px">
                  <el-input
                    v-model="userInfoForm.email"
                    style="width: 320px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="80px">
                  <el-input
                    v-model="userInfoForm.password"
                    type="password"
                    style="width: 320px"
                    :disabled="isPasswordReadonly"
                  ></el-input>
                  <el-button
                    v-if="isPasswordReadonly"
                    type="primary"
                    @click="controlChangePasswordVisible()"
                    >修改密码</el-button
                  >
                </el-form-item>
                <!-- 点击修改密码后显示 -->
                <el-form-item
                  label="旧密码"
                  v-show="changePasswordVisible"
                  label-width="80px"
                  prop="oldPassword"
                  :rules="oldPassword"
                >
                  <el-input
                    type="password"
                    v-model="userInfoForm.oldPassword"
                    style="width: 320px"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="新密码"
                  v-show="changePasswordVisible"
                  label-width="80px"
                  prop="newPassword"
                  :rules="newPassword"
                >
                  <el-input
                    type="password"
                    v-model="userInfoForm.newPassword"
                    style="width: 320px"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="确认密码"
                  v-show="changePasswordVisible"
                  label-width="80px"
                  prop="confirmNewPassword"
                  :rules="confirmNewPassword"
                >
                  <el-input
                    type="password"
                    v-model="userInfoForm.confirmNewPassword"
                    style="width: 320px"
                  ></el-input>
                </el-form-item>
                <el-button
                  @click="controlChangePasswordVisible()"
                  v-show="changePasswordVisible"
                  style="margin-left: 275px"
                  >取消修改密码</el-button
                >
              </el-form>
              <div slot="footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveInfo('userInfoForm')"
                  >保存</el-button
                >
              </div>
            </el-dialog>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Header2 from "@/components/Header2.vue";
export default {
  name: "UserById.vue",
  components: { Header2 },
  data() {
    return {
      user: "",

      userInfoForm: {
        userId: "",
        username: "",
        password: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      // 密码是否不能操作
      isPasswordReadonly: true,
      // 资料编辑框是否显示
      dialogVisible: false,
      // 修改密码是否显示密码框
      changePasswordVisible: false,

      newPassword: [
        { required: false, message: "请输入新密码", trigger: "blur" },
        {
          min: 6,
          max: 20,
          message: "密码长度在 6 到 20 个字符",
          trigger: "blur",
        },
      ],
      confirmNewPassword: [
        { required: false, message: "请再次输入新密码", trigger: "blur" },
        { validator: this.checkPassword, trigger: "blur" },
      ],
      oldPassword: [
        { required: false, message: "请输入旧密码", trigger: "blur" },
      ],
    };
  },

  methods: {
    getUserInfo(userId) {
      this.$axios.get("/user/" + userId).then((res) => {
        this.user = res.data.data;
        this.userInfoForm.username = this.user.username;
        this.userInfoForm.email = this.user.email;
        this.userInfoForm.password = this.user.password;
        console.log("user-------------->", this.user);
      });
    },

    saveInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验通过，可以提交表单
          this.userInfoForm.userId = this.$store.getters.getUser.id;
          this.$axios
            .post("/user/update", this.userInfoForm, {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            })
            .then((res) => {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "success",
              });
              this.dialogVisible = false;
              this.getUserInfo(this.$store.getters.getUser.id);
              // 替换原有共享数据
              const userInfo = res.data.data;
              this.$store.commit("SET_USERINFO", userInfo);
            })
            .catch((error) => {
              console.log("error------------------->", error);
              this.$message({
                showClose: true,
                message: error,
                type: "error",
              });
            });
        } else {
          // 校验不通过，无法提交表单
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 校验两次密码输入
    checkPassword(rule, value, callback) {
      if (value !== this.userInfoForm.newPassword) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    },

    controlChangePasswordVisible() {
      this.userInfoForm.oldPassword = "";
      this.userInfoForm.newPassword = "";
      this.userInfoForm.confirmNewPassword = "";
      this.changePasswordVisible = !this.changePasswordVisible;
    },

    handleAvatarSuccess(res, file) {
      this.$message({
        showClose: true,
        message: res.msg,
        type: "success",
      });
      // 修改用户信息再次共享出去
      const userInfo = this.$store.getters.getUser;
      userInfo.avatar = res.data;
      this.$store.commit("SET_USERINFO", userInfo);

      this.user.avatar = this.$store.getters.getUser.avatar;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },

  created() {
    const userId = this.$route.params.userId;
    console.log("userId------->", userId);
    this.getUserInfo(userId);
  },
};
</script>




<style>
.userStyle {
  margin-left: 220px;
  margin-right: 550px;
  margin-top: 80px;
  text-align: left;
}
.userContainer {
  display: flex;
  flex-direction: row;
}

.left {
  flex: 1;
}

.right {
  flex: 6;
}

/* 头像上传显示 */

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  height: 100%;
  width: 100%;
  line-height: 100%;
  text-align: center;
}

.avatar-uploader {
  width: 90%;
  height: 90%;
}
</style>

