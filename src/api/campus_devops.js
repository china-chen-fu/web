import request from "@/utils/request";
const BaseURL = "/gw_campus_devops";

//外部的请求包裹一层参数
const externalRequest = (config) => {
  config.url = `${BaseURL}${config.url}`;
  return request(Object.assign(config, { external: true }));
};

// 获取用户详细信息 基础服务
export function findGatewayListAPI(params) {
  return externalRequest({
    url: `/system/gateway/lists`,
    method: "get",
    params,
  });
}

//得到网关下所有表具
export function getGatewayDeviceListAPI(params) {
  return externalRequest({
    url: `/system/gateway/getDevice`,
    method: "get",
    params,
  });
}

// 查询表具列表
export function getDeviceListAPI(params) {
  return externalRequest({
    url: `/system/device/list`,
    method: "get",
    params,
  });
}

//更新在线状态
export function pingGatewayAPI(data) {
  return externalRequest({
    url: `/system/gateway/gateways-extend-ping`,
    method: "post",
    data,
  });
}
