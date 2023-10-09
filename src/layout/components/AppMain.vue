<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="keepList">
          <component
            :is="Component"
            v-if="!route.meta.link"
            :key="route.path"
          />
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup>
import iframeToggle from "./IframeToggle/index";
import useTagsViewStore from "@/store/modules/tagsView";

import { computed } from "vue";
import useKeepStore from "@/store/modules/keepAlive";
const keepStore = useKeepStore();
const keepList = computed(() => {
  return keepStore.keepList;
});
const tagsViewStore = useTagsViewStore();

</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 72px);
  width: 100%;
  //min-width: 1200px;
  //padding-left: 200px;
  position: relative;
  //overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>
