import request from "@/utils/request";

const BASE_URL = "/energy/manage/buildingDevice";

//获取所有表具
export function getDeviceInfoOptionsAPI(params) {
  return request({
    url: `${BASE_URL}/getDeviceInfo`,
    method: "get",
    params
  });
}

//查询绑表列表
export function getDeviceListAPI(params) {
  return request({
    url: `${BASE_URL}/list`,
    method: "get",
    params
  });
}

//新增绑表关系
export function createBuildingDeviceAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "post",
    data
  });
}

//换表
export function editBuildingDeviceAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "put",
    data
  });
}

//解除绑定
export function unbindBuildingDeviceAPI(buildingDeviceId) {
  return request({
    url: `/energy/manage/UnbindingDevice/${buildingDeviceId}`,
    method: "put"
  });
}

//历史记录
export function getDeviceHistoryListAPI(params) {
  return request({
    url: `${BASE_URL}/history`,
    method: "get",
    params
  });
}

//根据id获取地址
export function getDeviceInfoAPI(id) {
  return request({
    url: `/energy/manage/buildingDevice/getDevice/${id}`,
    method: "get"
  });
}
