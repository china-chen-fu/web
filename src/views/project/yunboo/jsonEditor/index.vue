<template>
  <JsonEditorVue
    style="height: 300px; width: 400px"
    v-model="value"
    v-bind="{
      /* local props & attrs */
      mode: 'text',
      mainMenuBar: false,
      statusBar: false,
      navigationBar: false,
      askToFormat: true
    }"
    @error="onError"
  />
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'

const value = ref()

const onError = (err) => {
  console.log(err)
}
</script>

<style scoped lang="scss"></style>
