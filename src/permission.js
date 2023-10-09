import router from "./router";
import { ElMessage } from "element-plus";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@/utils/auth";
import { isHttp } from "@/utils/validate";
import { isRelogin } from "@/utils/request";
import useUserStore from "@/store/modules/user";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";
NProgress.configure({ showSpinner: false });
let flag = false
router.beforeEach((to, from, next) => {
  //从这边开始就是进行页面加载的初始话
  /*
  * if(有token){
  *   if(roles列表为空){// 刷新页面的时候会触发
  *     获取登录人当前信息;
  *     获取当前登录人的路由映射表;
  *     （token过期失效的话前往到登录页面）
  *   }else{
  *     路由跳到第一个路由或者是目标路由;
  *     将返回的路由映射表添加到默认路由当中;
  *     找到第一个路由进行路由跳转;
  *   }
  * }else{
  *  去登录页进行登录，来获得token信息;
  * }
  * */
  if(!flag){
      usePermissionStore()
          .generateCampusRoutes(useUserStore().roles)
          .then((accessRoutes) => {
              // 根据roles权限生成可访问的路由表
              accessRoutes.forEach((route) => {
                  if (!isHttp(route.path)) {
                      router.addRoute(route); // 动态添加可访问路由表
                  }
              });
              let first = findFirstChild(accessRoutes);
              flag = true
              if (to.path === "/") {
                  next(`/${first}`);
              } else {
                  next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
              }
          });
  }else{
      if (to.path === "/") {
          next(`/${first}`);
      } else {
          next();
      }
  }





  // if (getToken()) {
  //   if (useUserStore().roles.length === 0) {
  //     isRelogin.show = true;
  //     // 判断当前用户是否已拉取完user_info信息
  //     useUserStore()
  //       .getCampusInfo()
  //       .then((res) => {
  //         isRelogin.show = false;
  //         usePermissionStore()
  //           .generateCampusRoutes(useUserStore().roles)
  //           .then((accessRoutes) => {
  //             // 根据roles权限生成可访问的路由表
  //             accessRoutes.forEach((route) => {
  //               if (!isHttp(route.path)) {
  //                 router.addRoute(route); // 动态添加可访问路由表
  //               }
  //             });
  //             let first = findFirstChild(accessRoutes);
  //             if (to.path == "/") {
  //               next(`/${first}`);
  //             } else {
  //               next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
  //             }
  //           });
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //         useUserStore()
  //           .logoutGateway()
  //           .then(() => {
  //             location.replace(import.meta.env.VITE_APP_LOGIN_OUT_PATH);
  //           });
  //       });
  //   } else {
  //     if (to.path == "/") {
  //       next(`/${first}`);
  //     } else {
  //       next();
  //     }
  //   }
  // } else {
  //   location.href = import.meta.env.VITE_APP_LOGIN_OUT_PATH;
  // }



});

//获取平台下对应路由表
const findFirstChild = (arr) => {
  const length = arr.length;
  for (let i = 0; i < length; i++) {
    if (arr[i].children) {
      return findFirstChild(arr[i].children);
    } else if (!arr[i].children || arr[i].children.length === 0) {
      if (arr[i].platformId === 4) {
        return `${arr[i].path}`;
      } else {
        return arr[i].path;
      }
    }
  }
};
router.afterEach(() => {
  NProgress.done();
});
