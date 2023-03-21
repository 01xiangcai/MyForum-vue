<template>
  <div class="el-footer">footer</div>
</template>

<script>
export default {
  name: "Footer",
};
</script>



<style scoped>
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
  width: 100%;
  position: static; /* 将 Footer 的定位方式设置为 static，取消固定定位 */
  bottom: 0;
}
</style>