<template>
  <div class="userStyle">
    <el-card class="box-card">
      <div class="container">
        <div class="left" >
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            style="width: 70%; height: 70%"
          ></el-avatar>
        </div>
        <div class="right">
          <span>用户名字 </span>
          <p>用户邮箱</p>
          <el-button style="float: right; padding: 3px 0" type="text"
            >编辑资料</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>






<style scoped>
.userStyle {
  margin-left: 220px;
  margin-right: 550px;
  margin-top: 80px;
  text-align: left;
}
.container {
  display: flex;
  flex-direction: row;
}

.left {
  flex: 1;
}

.right {
  flex: 6;
}
</style>

