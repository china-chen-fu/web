<template>
  <div class="img-viewer-box">
    <el-image-viewer :url-list="props.imgs" @close="close" v-if="modelValue" />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  imgs: {
    type: Array,
    default: []
  }
})

const emits = defineEmits(['update:modelValue'])
// 点击关闭的时候，连同小图一起关闭
function close() {
  emits('update:modelValue', false)
}
</script>

<style lang="scss" scoped></style>
