<template>
  <div class="app-wrapper">
    <div class="main-container">
      <div class="fixed-header main-header">
        <navbar />
      </div>
      <div class="main-body" :class="{'sidebar-hide': classObj.hide}">
        <sidebar class="sidebar-container" />
        <app-main class="main-app"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import Sidebar from './components/Sidebar/index.vue'
import { AppMain, Navbar } from './components'
import defaultSettings from '@/settings'

import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import {computed, watch} from "vue";
import {useRoute} from "vue-router";


// const settingsStore = useSettingsStore()
// const theme = computed(() => settingsStore.theme);
// const sideTheme = computed(() => settingsStore.sideTheme);
const sidebar = computed(() => useAppStore().sidebar);
// const device = computed(() => useAppStore().device);
// const fixedHeader = computed(() => settingsStore.fixedHeader);
//
const classObj = computed(() => ({
  // hideSidebar: !sidebar.value.opened,
  // openSidebar: sidebar.value.opened,
  // withoutAnimation: sidebar.value.withoutAnimation,
  // mobile: device.value === 'mobile'
  hide: sidebar.value.hide
}))

// const { width, height } = useWindowSize();
// const WIDTH = 992; // refer to Bootstrap's responsive design

// watchEffect(() => {
//   // if (device.value === 'mobile' && sidebar.value.opened) {
//   //   useAppStore().closeSideBar({ withoutAnimation: false })
//   // }
//   // if (width.value - 1 < WIDTH) {
//   //   useAppStore().toggleDevice('mobile')
//   //   useAppStore().closeSideBar({ withoutAnimation: true })
//   // } else {
//   //   useAppStore().toggleDevice('desktop')
//   // }
//   // useAppStore().toggleDevice('desktop')
// })
// watch(()=>useRoute.path, (m)=>{
//   console.log(m)
// })



// function handleClickOutside() {
//   useAppStore().closeSideBar({ withoutAnimation: false })
// }

// const settingRef = ref(null);
// function setLayout() {
//   settingRef.value.openSetting();
// }

// watch(() =>useRoute,(newValue,oldValue)=> {
//   console.log('watch11',newValue);
// },{ immediate: true })
//

</script>

<style lang="scss" scoped>
  @import "@/assets/styles/mixin.scss";
  @import "@/assets/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  //width: calc(100% - #{$base-sidebar-width});
  width: 100%;
  transition: width 0.28s;
}

.main-app {
  //margin-left: calc(100% - #{$base-sidebar-width});
  position: absolute;
  left: #{$base-sidebar-width};
  right: 0;
  top: 70px;
}

</style>
