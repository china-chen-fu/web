<template>
  <div>
    <el-upload
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      name="file"
      :show-file-list="false"
      :headers="headers"
      style="display: none"
      ref="uploadRef"
      v-if="props.type == 'url'"
    >
    </el-upload>
    <div class="editor" ref="editorRef" :style="styles"></div>
  </div>
</template>
<script setup>
import { getToken } from "@/utils/auth";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { onMounted } from "vue";

let { proxy } = getCurrentInstance();
const props = defineProps({
  /* 编辑器的内容 */
  value: {
    type: String,
    default: "",
  },
  /* 高度 */
  height: {
    type: Number,
    default: null,
  },
  /* 最小高度 */
  minHeight: {
    type: Number,
    default: null,
  },
  /* 只读 */
  readOnly: {
    type: Boolean,
    default: false,
  },
  // 上传文件大小限制(MB)
  fileSize: {
    type: Number,
    default: 5,
  },
  /* 类型（base64格式、url格式） */
  type: {
    type: String,
    default: "url",
  },
});
// 如果使用两次，则把,"update:input1"添加到defineEmits里面
const emit = defineEmits([
  "update:input",
  "update:on-change",
  "update:on-text-change",
  "update:on-selection-change",
  "update:on-editor-change",
]);
let uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/upload");
let headers = ref({ Authorization: "Bearer " + getToken() });
let currentValue = ref("");
let options = ref({
  theme: "snow",
  bounds: document.body,
  debug: "warn",
  modules: {
    // 工具栏配置
    toolbar: [
      ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
      ["blockquote", "code-block"], // 引用  代码块
      [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
      [{ indent: "-1" }, { indent: "+1" }], // 缩进
      [{ size: ["small", false, "large", "huge"] }], // 字体大小
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
      [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
      [{ align: [] }], // 对齐方式
      ["clean"], // 清除文本格式
      ["link", "image"], // 链接、图片、视频("video")
    ],
  },
  placeholder: "请输入内容",
  readOnly: props.readOnly,
});
const editorRef = ref(null);
const uploadRef = ref();
let styles = computed(() => {
  let style = {};
  if (props.minHeight) {
    style["minHeight"] = `${props.minHeight}px`;
  }
  if (props.height) {
    style["height"] = `${props.height}px`;
  }
  return style;
});

watch(
  () => props.value,
  (val) => {
    if (val !== currentValue.value) {
      currentValue.value = val === null ? "" : val;
      if (Quill && Quill.pasteHTML) {
        Quill.pasteHTML(currentValue.value);
      }
    }
  },
  { deep: true, immediate: true }
);
const init = () => {
  let initEditor = editorRef.value;
  let QuillClass = new Quill(initEditor, options.value);
  QuillClass.pasteHTML(currentValue.value);
  QuillClass.on("text-change", (delta, oldDelta, source) => {
    let html = editorRef.value.children[0].innerHTML;
    let text = QuillClass.getText();
    let quill = Quill;
    currentValue.value = html;
    emit("update:input", html);
    //  proxy.emit("update:input1", html);  //如果使用两次，则添加这行代码
    emit("update:on-change", { html, text, quill });
  });
  QuillClass.on("text-change", (delta, oldDelta, source) => {
    emit("update:on-text-change", delta, oldDelta, source);
  });
  QuillClass.on("selection-change", (range, oldRange, source) => {
    emit("update:on-selection-change", range, oldRange, source);
  });
  QuillClass.on("editor-change", (eventName, ...args) => {
    emit("update:on-editor-change", eventName, ...args);
  });
};

// 上传前校检格式和大小
const handleBeforeUpload = (file) => {
  // 校检文件大小
  if (props.fileSize) {
    let isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy.$message.error(`上传文件大小不能超过 ${props.fileSize} MB!`);
      return false;
    }
  }
  return true;
};
const handleUploadSuccess = (res, file) => {
  // 获取富文本组件实例
  let quill = Quill;
  // 如果上传成功
  if (res.code == 200) {
    // 获取光标所在位置
    let length = quill.getSelection().index;
    // 插入图片  res.url为服务器返回的图片地址
    quill.insertEmbed(
      length,
      "image",
      import.meta.env.VUE_APP_BASE_API + res.fileName
    );
    // 调整光标到最后
    quill.setSelection(length + 1);
  } else {
    proxy.$message.error("图片插入失败");
  }
};
const handleUploadError = () => {
  proxy.$message.error("图片插入失败");
};
onMounted(() => {
  init();
});
</script>
<style>
.editor,
.ql-toolbar {
  white-space: pre-wrap !important;
  line-height: normal !important;
}
.quill-img {
  display: none;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
