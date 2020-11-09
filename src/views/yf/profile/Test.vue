<template>
  <div class="clearfix">
    <a-upload :file-list="hbfileList" :remove="handleRemove" :before-upload="beforeUpload">
      <a-button> <a-icon type="upload" /> 选择上传核保附件 </a-button>
    </a-upload>
    <a-button
      type="primary"
      :disabled="hbfileList.length === 0"
      :loading="uploading"
      style="margin-top: 16px"
      @click="handleUpload"
    >
      {{ uploading ? 'Uploading' : 'Start Upload' }}
    </a-button>
  </div>
</template>
<script>
import { postAction } from '@api/manage'
export default {
  data() {
    return {
      hbfileList: [],
      uploading: false,
    };
  },
  methods: {
    handleRemove(file) {
      const index = this.hbfileList.indexOf(file);
      const newFileList = this.hbfileList.slice();
      newFileList.splice(index, 1);
      this.hbfileList = newFileList;
    },
    beforeUpload(file) {
      this.hbfileList = [...this.hbfileList, file];
      return false;
    },
    handleUpload() {
      const { hbfileList } = this;
      const formData = new FormData();
      hbfileList.forEach(file => {
        formData.append('files', file);
      });
      this.uploading = true;

      let url = 'yf/upload'
      formData.append("proserialno", '5301YF16024706321450010');
      // You can use any AJAX library you like
      postAction(url, formData).then((res) => {
        if (res.success) {
          this.hbfileList = [];
          this.uploading = false;
          this.$message.success('upload successfully.');
        } else {
          this.uploading = false;
          this.$message.error('upload failed.');
        }
      })

      
    },
  },
};
</script>
