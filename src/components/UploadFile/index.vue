<template>
  <div>
    <!-- 导入弹窗 -->
    <el-dialog :title="title" :model-value="visible" width="400px" append-to-body :destroy-on-close="true" @close="emits('update:visible', false)">
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="uploadUrl"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip" v-if="props && props.showUpdateExistData">
              <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">下载模板 </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="upload.isUploading" type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="cancelUpload">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
//文件上传
import { reactive, toRefs, watch } from "vue";
import { getToken } from "@/utils/auth";
const { proxy } = getCurrentInstance();

const props = defineProps({
  visible: {
    // 是否显示弹出层（用户导入）
    type: Boolean,
    default: false
  },
  title: {
    // 弹出层标题（用户导入）
    type: String,
    default: "导入"
  },
  uploadURL: {
    required: true,
    type: String
  },
  importTemplateName: {
    type: String,
    default: "导入模板"
  },
  importTemplateURL: {
    required: true,
    type: String
  },
  showUpdateExistData: {
    type: Boolean,
    default: false
  }
});
//handleFileSuccess 让父元素刷新列表数据
const emits = defineEmits(["update:visible", "handleFileSuccess"]);

const { visible, title, uploadURL, importTemplateName, importTemplateURL } = toRefs(props);

/*** 用户导入参数 */
const upload = reactive({
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  // "Bearer " +
  headers: { Authorization:  getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + import.meta.env.VITE_APP_APPLICATION_SERVICE + `/${uploadURL.value}`
});
let uploadUrl = computed(() => {
  if (props.showUpdateExistData) {
    return upload.url + "?updateSupport=" + upload.updateSupport;
  } else {
    return upload.url;
  }
});

/** 下载模板操作 */
function importTemplate() {
  proxy.download(importTemplateURL.value, {}, `${importTemplateName.value}_${new Date().getTime()}.xlsx`);
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {
    dangerouslyUseHTMLString: true
  });
  emits("handleFileSuccess");
  emits("update:visible", false);
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}

function cancelUpload() {
  upload.isUploading = false;
  emits("update:visible", false);
}
</script>

<style lang="scss" scoped></style>
