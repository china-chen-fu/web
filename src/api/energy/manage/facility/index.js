import request from "@/utils/request";

const BASE_URL = "/energy/manage/facility";

//获取列表
export function getFacilityListAPI(params) {
  return request({
    url: `${BASE_URL}/page`,
    method: "get",
    params
  });
}

//新增
export function createFacilityAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "post",
    data
  });
}

//编辑
export function updateFacilityAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "put",
    data
  });
}

//删除
export function deleteFacilityAPI(typeId) {
  return request({
    url: `${BASE_URL}/${typeId}`,
    method: "delete"
  });
}

//获取设施 建筑树
export function getBuildingTreeAPI(params) {
  return request({
    url: `/energy/manage/building/tree`,
    method: "get",
    params
  });
}

//设施类型下拉
export function getFacilityTypeOptionsAPI(data) {
  return request({
    url: `/energy/manage/facilityType/list`,
    method: "get",
    params: data
  });
}

//关联表具下拉
export function getDeviceOptionsAPI(params) {
  return request({
    url: `/energy/manage/facility/getDeviceInfo`,
    method: "get",
    params
  });
}

//获取待排序的列表
export function getBeforeSortListAPI(params) {
  return request({
    url: `${BASE_URL}/list`,
    method: "get",
    params
  });
}

export function commitAfterSortListAPI(data) {
  return request({
    url: `${BASE_URL}/sort`,
    method: "post",
    data
  });
}

//房间名称下拉
export function getRoomOptionsAPI(params) {
  return request({
    url: `/energy/manage/building/roomList`,
    method: "get",
    params
  });
}

//获取设施树
export function getFacilityTreeAPI() {
  return request({
    url: `/energy/manage/facility/tree`,
    method: "get",
  });
}

//获取设施树
export function getNewRegionTreeAPI(data) {
  return request({
    url: `/energy/manage/building/facilityTree`,
    method: "get",
    params: data
  });
}
