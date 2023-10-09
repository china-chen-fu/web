<template>
  <router-view v-slot="{ Component }">
        <!--          todo 添加通过pinia动态设置页面缓存-->
        <keep-alive>
            <component :is="Component" />
        </keep-alive>
    </router-view>
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
onMounted(() => {
  window.onbeforeunload = (e) => {
    //刷新时弹出提示
    console.log('页面刷新')
  }
  nextTick(() => {
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>
