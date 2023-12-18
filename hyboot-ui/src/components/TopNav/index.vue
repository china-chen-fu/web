<template>
  <el-menu :default-active="activeMenu" mode="horizontal" @select="handleSelect" :ellipsis="false">
    <template v-for="(item, index) in topMenus">
      <el-menu-item style="margin-right: 60px !important" :index="item.path" :key="index" v-if="index < visibleNumber">
        <!--        <svg-icon :icon-class="item.meta.icon" />-->
        {{ item.meta.title }} <span v-if="(item.path == '/alarm' || item.path == '/abnormalAlarm' || item.path == '/warn') && showPointer" class="alarm-point"></span>
      </el-menu-item>
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-sub-menu :style="{ '--theme': theme }" index="more" v-if="topMenus.length > visibleNumber">
      <template #title>更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item :index="item.path" :key="index" v-if="index >= visibleNumber">
          <svg-icon :icon-class="item.meta.icon" />
          {{ item.meta.title }}
        </el-menu-item>
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { constantRoutes } from "@/router"
import { isHttp } from '@/utils/validate'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import useAlarmStore from '@/store/modules/payment/alarm'
import { ref, watch } from 'vue';
import { useRouter, useRoute } from "vue-router"

// 顶部栏初始数
const visibleNumber = ref(null);
// 当前激活菜单的 index
const currentIndex = ref(null);
// 隐藏侧边栏路由
const hideList = ['/index', '/user/profile'];

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const alarmStore = useAlarmStore()
const route = useRoute();
const router = useRouter();

const topMenusArr = ref(null)

// 主题颜色
const theme = computed(() => settingsStore.theme);
// 所有的路由信息
const routers = computed(() => permissionStore.topbarRouters);

let platformId = ref(null)

// 顶部显示菜单
const topMenus = computed(() => {
  let topMenus = [];
  routers.value.map((menu) => {
    if (menu.hidden !== true) {
      // 兼容顶部栏一级菜单内部跳转
      if (menu.path === "/") {
        topMenus.push(menu.children[0]);
      } else {
        topMenus.push(menu);
      }
    }
  })
  topMenusArr.value = topMenus;
  platformId.value = topMenus[0].platformId;
  return topMenus;
})

// 设置子路由
const childrenMenus = computed(() => {
  let childrenMenus = [];
  routers.value.map((router) => {
    for (let item in router.children) {
      if (router.children[item].parentPath === undefined) {
        if (router.path === "/") {
          router.children[item].path = "/" + router.children[item].path;
        } else {
          if (!isHttp(router.children[item].path)) {
            router.children[item].path = router.path + "/" + router.children[item].path;
          }
        }
        router.children[item].parentPath = router.path;
      }
      childrenMenus.push(router.children[item]);
    }
  })
  return constantRoutes.concat(childrenMenus);
})

// 默认激活的菜单
const activeMenu = computed(() => {
  const path = route.path;
  let activePath = path;
  if (path !== undefined && path.lastIndexOf("/") > 0 && hideList.indexOf(path) === -1) {
    const tmpPath = path.substring(1, path.length);
    activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
    appStore.toggleSideBarHide(false);
  } else if (!route.children) {
    activePath = path;
    appStore.toggleSideBarHide(true);
  }
  activeRoutes(activePath);
  return activePath;
})

let showPointer = computed(() => {
  let flag = false;
  if (alarmStore.alarmNum > 0) {
    flag = true
  }
  if (route.path.includes('/alarm/InstrumentOffline') || route.path.includes('/abnormalAlarm') || route.path.includes('/warn/warn/warning')) {
    flag = false
  }
  return flag;
});
let timer = null;

watch(platformId, (newValue) => {
  alarmStore.getAlarmNum(newValue);
})

onMounted(() => {
  alarmStore.getAlarmNum(platformId.value);
  timer = setInterval(() => {
    alarmStore.getAlarmNum(platformId.value);
  }, 1000 * 60 * 10)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})

function setVisibleNumber () {
  const width = document.body.getBoundingClientRect().width / 3;
  visibleNumber.value = parseInt(width / 50);
}

function removeSession () {
  sessionStorage.removeItem('bs');
  sessionStorage.removeItem('stallPage');
  sessionStorage.removeItem('stallStatusInfo');
}

function handleSelect (key, keyPath) {
  currentIndex.value = key;
  const route = routers.value.find(item => item.path === key)
  removeSession();
  if (isHttp(key)) {
    // http(s):// 路径新窗口打开
    window.open(key, "_blank");
  } else if (!route || !route.children) {
    // 没有子路由路径内部打开
    router.push({ path: key });
    appStore.toggleSideBarHide(true);
  } else if (route && route.children && route.children.length > 0) {
    router.push({ path: route.children[0].path });
    appStore.toggleSideBarHide(false);
  } else {
    // 显示左侧联动菜单
    activeRoutes(key);
    appStore.toggleSideBarHide(false);
  }
}

function activeRoutes (key) {
  let routes = [];
  if (childrenMenus.value && childrenMenus.value.length > 0) {
    childrenMenus.value.map((item) => {
      if (key == item.parentPath || (key == "index" && "" == item.path)) {
        routes.push(item);
      }
    });
  }
  if (routes.length > 0) {
    permissionStore.setSidebarRouters(routes);
  }
  return routes;
}

onMounted(() => {
  window.addEventListener('resize', setVisibleNumber)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setVisibleNumber)
})

onMounted(() => {
  setVisibleNumber()
})
</script>

<style lang="scss">
.topmenu-container.el-menu--horizontal>.el-menu-item {
  float: left;
  height: 70px !important;
  line-height: 70px !important;
  color: #8E92BC !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}

.topmenu-container.el-menu--horizontal>.el-menu-item.is-active,
.el-menu--horizontal>.el-sub-menu.is-active .el-submenu__title {
  border-bottom: 2px solid #{'var(--theme)'} !important;
  color: #303133;
}

/* sub-menu item */
.topmenu-container.el-menu--horizontal>.el-sub-menu .el-sub-menu__title {
  float: left;
  height: 70px !important;
  line-height: 70px !important;
  color: #8E92BC !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}

.topmenu-container.el-menu--horizontal>.el-menu-item.is-active,
.el-menu--horizontal>.el-sub-menu.is-active .el-submenu__title {
  color: #141522 !important;
  border-bottom: 4px solid #546FFF !important;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  // background-color: #fff !important;
}

.el-menu {
  --el-menu-item-hover-fill: none !important;
  --el-menu-hover-bg-color: none !important;
}

.el-menu-item {
  transition: none;
  font-size: 16px !important;
}

.alarm-point {
  width: 8px;
  height: 8px;
  display: inline-block;
  background-color: red;
  border-radius: 50%;
  margin-left: 5px;
}
</style>
