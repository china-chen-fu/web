import request from "@/utils/request";

// 获取用户详细信息 基础服务
export function getCampusInfo() {
  return request({
    url: "/gw_campus_devops/getInfo",
    method: "get",
    isCampus: true,
  });
}

// 获取路由 基础服务
export const getCampusRouters = () => {
  return request({
    url: "/gw_campus_devops/getPlatformRouters",
    method: "get",
    headers: {
      AppId: import.meta.env.VITE_APP_CLIENT_APP_ID,
    },
    isCampus: true,
  });
};

// 登录出检查  网关
export const logoutGateway = () => {
  return request({
    url: "/sso/logout",
    method: "post",
    isSso: true,
  });
};

// 获取系统模块
export const getPlatforms = () => {
  return request({
    url: "/gw_campus_devops/getPlatforms",
    method: "get",
    isCampus: true,
  });
};

//建筑分组
export function getBuildingDictionaryListAPI(params) {
  return request({
    url: `/gw_campus_devops/energy/buildingDictionary/list`,
    method: "get",
    params,
    isCampus: true,
  });
}
