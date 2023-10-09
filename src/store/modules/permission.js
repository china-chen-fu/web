import auth from "@/plugins/auth";
import router, { constantRoutes, dynamicRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";
import InnerLink from "@/layout/components/InnerLink";
import { setPlatform } from "@/utils/auth";
import { getCampusRouters } from "@/api/campus";
import { getPlatforms } from "@/api/campus";
import {pageRoutes} from "@/data/routes";

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("./../../views/**/*.vue");

const usePermissionStore = defineStore("permission", {
  state: () => ({
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
    platforms: [],
    platform: {},
  }),
  actions: {
    setRoutes(routes) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes);
    },
    setTopbarRoutes(routes) {
      this.topbarRouters = routes;
    },
    setSidebarRouters(routes) {
      this.sidebarRouters = routes;
    },
    generateCampusRoutes(roles) {
      return new Promise((resolve) => {
        // 向后端请求路由数据
        // getCampusRouters()
        //   .then((res) => {
        //
        //   })
        //   .catch((err) => {});

        const sdata = JSON.parse(JSON.stringify(pageRoutes.data));
        const rdata = JSON.parse(JSON.stringify(pageRoutes.data));
        const defaultData = JSON.parse(JSON.stringify(pageRoutes.data));
        const sidebarRoutes = filterAsyncRouter(sdata);
        const rewriteRoutes = filterAsyncRouter(rdata, false, true);
        const defaultRoutes = filterAsyncRouter(defaultData);
        const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
        asyncRoutes.forEach((route) => {
          router.addRoute(route);
        });
        this.setRoutes(rewriteRoutes);
        this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
        this.setDefaultRoutes(sidebarRoutes);
        this.setTopbarRoutes(defaultRoutes);
        resolve(rewriteRoutes);
      });
    },
    generateRoutes(roles) {
      return new Promise((resolve) => {
        // 向后端请求路由数据
        getRouters().then((res) => {
          const sdata = JSON.parse(JSON.stringify(res.data));
          const rdata = JSON.parse(JSON.stringify(res.data));
          const defaultData = JSON.parse(JSON.stringify(res.data));
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          const defaultRoutes = filterAsyncRouter(defaultData);
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
          asyncRoutes.forEach((route) => {
            router.addRoute(route);
          });
          this.setRoutes(rewriteRoutes);
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
          this.setDefaultRoutes(sidebarRoutes);
          this.setTopbarRoutes(defaultRoutes);
          resolve(rewriteRoutes);
        });
      });
    },
    getPlatforms() {
      return new Promise((resolve) => {
        getPlatforms()
          .then((res) => {
            this.platforms = res.data || [];
            if (this.platforms.length) {
              let ps = this.platforms.filter(
                (f) => f.appId == import.meta.env.VITE_APP_CLIENT_APP_ID
              );
              if (ps.length > 0) {
                this.platform = ps[0];
              }
            }
            resolve();
          })
          .catch((err) => {
            console.error(err);
          });
      });
    },
    changeRoute(platformId) {
      return new Promise((resolve) => {
        let routes = this.allRoutes.filter((f) => f.platformId == platformId);
        const sdata = JSON.parse(JSON.stringify(routes));
        const rdata = JSON.parse(JSON.stringify(routes));
        const defaultData = JSON.parse(JSON.stringify(routes));
        const sidebarRoutes = filterAsyncRouter(sdata);
        const rewriteRoutes = filterAsyncRouter(rdata, false, true);
        const defaultRoutes = filterAsyncRouter(defaultData);
        const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
        asyncRoutes.forEach((route) => {
          router.addRoute(route);
        });
        this.setRoutes(rewriteRoutes);
        this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
        this.setDefaultRoutes(sidebarRoutes);
        this.setTopbarRoutes(defaultRoutes);
        //  构建路由
        rewriteRoutes.forEach((route) => {
          if (!isHttp(route.path)) {
            router.addRoute(route); // 动态添加可访问路由表
          }
        });
        setPlatform(platformId);

        let ps = this.platforms.filter((f) => f.platformId == platformId);
        if (ps.length > 0) {
          this.platform = ps[0];
        }
        resolve(defaultRoutes);
      });
    },
  },
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else if (route.component === "InnerLink") {
        route.component = InnerLink;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === "ParentView" && !lastRouter) {
        el.children.forEach((c) => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = [];
  routes.forEach((route) => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route);
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route);
      }
    }
  });
  return res;
}

export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
};

export default usePermissionStore;
