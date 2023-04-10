<template>
  <div>
    <!--点击按钮触发图片统一上传-->
    <el-button @click="uploadimgs()">统一上传图片</el-button>
    <mavon-editor ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel" v-model="des">
      <template slot="left-toolbar-after">
        <input
          type="file"
          accept=".md"
          ref="fileInput"
          style="display: none"
          @change="importMd($event)"
        />
        <button
          type="button"
          @click="openFileInput"
          class="op-icon fa fa-mavon-align-left"
          aria-hidden="true"
          title="导入md文档"
        ></button>
      </template>
    </mavon-editor>
  </div>
</template>


<script>
export default {
  name: "MyTestIndex.vue",
  data() {
    return {
      img_file: {},
      des: "",
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
        formdata.append("files", this.img_file[_img]);
        console.log(
          "formdata.get('files')----------------------->",
          formdata.get("files")
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
          console.log("执行res--------------->", res);
          for (let { pos, url } of res.data.data) {
            console.log("执行啊res--------------->", res.data.data);
            // $vm.$img2Url 详情见本页末尾
            $vm.$img2Url(pos, url);
          }
        })
        .catch((error) => {
          console.error("发生了错误", error);
        });
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    //导入md文档
    importMd(e) {
      const file = e.target.files[0];
      if (!file.name.endsWith(".md")) {
        this.$message.warning("文件扩展名必须为.md！");
        return;
      }
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (res) => {
        this.des = res.target.result;
        console.log("res-------------->", res);
        this.$message({
          showClose: true,
          message: "上传成功，图片需要重新上传！！！",
          type: "success",
        });
      };
      e.target.value = null;
    },
  },
};
</script>


