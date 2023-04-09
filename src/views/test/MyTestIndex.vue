<template>
  <div>
    <!--点击按钮触发图片统一上传-->
    <el-button @click="uploadimgs()">统一上传图片</el-button>
    <mavon-editor ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel"></mavon-editor>
  </div>
</template>


<script>
export default {
  name: "MyTestIndex.vue",
  data() {
    return {
      img_file: {},
    };
  },
  methods: {
    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      // 缓存图片信息
      this.img_file[pos] = $file;
      console.log("this.img_file-------------->", this.img_file);
    },
    $imgDel(pos) {
      // 从 imgFiles 中删除指定位置的图片
      delete this.img_file[pos];
    },

    uploadimgs($e) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();

      for (var _img in this.img_file) {
        console.log("this.img_file[_img]----------->", this.img_file[_img]);
        formdata.append(_img, this.img_file[_img]);
        console.log(
          "formdata.get(_img)----------------------->",
          formdata.get(_img)
        );
      }

      console.log(formdata);

      this.$axios
        .post("/upload/uploadImagesBatch", formdata, {
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
};
</script>


