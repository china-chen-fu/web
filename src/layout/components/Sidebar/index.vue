<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground,
    }"
  >
    <!--    <logo v-if="showLogo" :collapse="isCollapse" />-->
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="false"
        :background-color="
          sideTheme === 'theme-dark'
            ? variables.menuBackground
            : variables.menuLightBackground
        "
        :text-color="
          sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
        :unique-opened="true"
        :active-text-color="theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>

      <!-- <div class="side--bar--bottom">
        <img src="@/assets/images/layout/bottom--img.png" alt="" />
      </div> -->
    </el-scrollbar>
  </div>
</template>

<script setup>
import deduplicate from "@/utils/deduplicate.js";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.module.scss";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";

const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
// const isCollapse = computed(() => !appStore.sidebar.opened);
const isCollapse = true;

const activeMenu = computed(() => {
  const { meta, path, name } = route; // --------子路由设置activeMenu高亮父路由 linhu--------------
  expandRoute(permissionStore.sidebarRouters);
  let arr = deduplicate(expandedRouteArr.value, ["path"]);
  let result = "";
  arr.forEach((item) => {
    if (path.includes(item.path)) {
      if (item.activeMenu) {
        result = item.activeMenu;
      }
    }
  }); // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    result = meta.activeMenu;
  } // --------
  return result ? result : path;
});
let expandedRouteArr = ref([]);
function expandRoute(arr) {
  arr.forEach((item) => {
    if (item.children && item.children.length) {
      expandedRouteArr.value.push({
        path: item.path,
        activeMenu: item.activeMenu ? item.activeMenu : "",
      });
      expandRoute(item.children);
    } else {
      expandedRouteArr.value.push({
        path: item.path,
        activeMenu: item.activeMenu ? item.activeMenu : "",
      });
    }
  });
}
</script>

<style scoped lang="scss">
.side--bar--bottom {
  position: absolute;
  bottom: 0;
  img {
    width: 252px;
  }
}
</style>
