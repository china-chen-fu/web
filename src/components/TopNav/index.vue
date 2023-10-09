<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <template v-for="(item, index) in topMenus">
      <el-menu-item
        v-if="index < visibleNumber"
        :key="index"
        :style="{ '--theme': theme }"
        :index="item.path"
        >
        <div class="flex-start">
          <svg-icon :icon-class="item.meta.icon" />
          <div class="menu-content-box">
            <div class="menu-content-box-title">{{ item.meta.title }}</div>
            <div class="menu-content-box-title-en">{{item.meta.englishName}}</div>
          </div>
        </div>
      </el-menu-item
      >
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-sub-menu
      v-if="topMenus.length > visibleNumber"
      :style="{ '--theme': theme }"
      index="more"
    >
      <template #title>
        <span class="theme-color">更多菜单</span>
      </template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
          v-if="index >= visibleNumber"
          :key="index"
          :index="item.path"
          class="theme-color"
          ><svg-icon :icon-class="item.meta.icon" class="theme-color" />
          {{ item.meta.title }}</el-menu-item
        >
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { constantRoutes } from "@/router";
import { isHttp } from "@/utils/validate";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";
import { findAllowPath } from "@/utils/findPath";
// 顶部栏初始数
const visibleNumber = ref(null);
// 当前激活菜单的 index
const currentIndex = ref(null);
// 隐藏侧边栏路由
const hideList = ["/index", "/user/profile"];

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const route = useRoute();
const router = useRouter();

// 主题颜色
const theme = computed(() => settingsStore.theme);
// 所有的路由信息
const routers = computed(() => permissionStore.topbarRouters);

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
  });
  return topMenus;
});

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
            router.children[item].path =
              router.path + "/" + router.children[item].path;
          }
        }
        router.children[item].parentPath = router.path;
      }
      childrenMenus.push(router.children[item]);
    }
  });
  return constantRoutes.concat(childrenMenus);
});

// 默认激活的菜单
const activeMenu = computed(() => {
  const path = route.path;
  let activePath = path;
  if (
    path !== undefined &&
    path.lastIndexOf("/") > 0 &&
    hideList.indexOf(path) === -1
  ) {
    const tmpPath = path.substring(1, path.length);
    activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
    if (!route.meta.link) {
      appStore.toggleSideBarHide(false);
    }
  } else if (!route.children) {
    activePath = path;
    appStore.toggleSideBarHide(true);
  }
  activeRoutes(activePath);
  return activePath;
});

function setVisibleNumber() {
  const width = document.body.getBoundingClientRect().width / 3;
  visibleNumber.value = parseInt(width / 80);
}

function handleSelect(key, keyPath) {
  // currentIndex.value = key
  // const route = routers.value.find((item) => item.path === key)
  // console.log(route, 'route');
  // let path = ''
  // let to = findAllowPath(route.children, path);
  // router.push({ path: to })
  const route = routers.value.find((item, index) => {
    if (item.path === key) {
      currentIndex.value = index;
    }
    return item.path === key;
  });
  if (isHttp(key)) {
    // http(s):// 路径新窗口打开
    window.open(key, "_blank");
  } else if (!route || !route.children) {
    // 没有子路由路径内部打开
    router.push({ path: key });
  } else if (route && route.children && route.children.length > 0) {
    //TODO  支持侧边栏存在二级菜单并且二级菜单是第一个  后期需要加递归
    if (route.children[0].children) {
      router.push({
        path: `${route.children[0].path}/${route.children[0].children[0].path}`,
      });
    } else {
      router.push({ path: route.children[0].path });
    }
  } else {
    // 显示左侧联动菜单
    activeRoutes(key);
  }
}

function activeRoutes(key) {
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
  } else {
    appStore.toggleSideBarHide(true);
  }
  return routes;
}

onMounted(() => {
  window.addEventListener("resize", setVisibleNumber);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", setVisibleNumber);
});

onMounted(() => {
  setVisibleNumber();
});
</script>

<style lang="scss">
@import "@/assets/styles/index.scss";
.el-menu--horizontal.topmenu-container.el-menu--horizontal{
  margin-left: 70px;
  flex: 1;
  border-bottom: none;
  $--active--font--color:#606266;
  $--font--color:#9FADBB;

  .el-menu-item{
    display: flex;
    flex-direction: column;
    //padding: 4px 21px 6px 21px ;
    border-bottom: none;
    line-height: inherit;
    color: $--font--color;
    font-size: 15px;
    font-weight: 400;

  +.el-menu-item{
    margin-left: 40px;
  }

    &:not(.is-disabled):hover{
      color: #4AA5A6 !important;
      background-color: rgba(74,165,166, 0.06);
    }

    .svg-icon{
      width: 34px;
      height: 34px;
    }

    &.is-active{
      border-bottom: none;
      //background: none;
      //color: $--active--font--color !important;
      color: #4AA5A6 !important;
      background-color: rgba(74,165,166, 0.06);
    }
  }
}

.flex-start {
  display: flex;
  align-items: flex-start
}

.menu-content-box {
  text-align: left;
  margin-left: 8px;
  font-size: 15px;

  .menu-content-box-title {
    line-height: 22px;
  }

  .menu-content-box-title-en {
    font-size: 12px;
    line-height: 18px;
    opacity: 0.8;
    font-family: Roboto;
  }
}

.theme-color {
  color: #9FADBB !important;
}
</style>
