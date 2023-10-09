import request from "@/utils/request";

const BASE_URL = "/energy/manage/building";
//获取列表
export function getBuildingListAPI(params) {
  return request({
    url: `${BASE_URL}/list`,
    method: "get",
    params
  });
}

//新增
export function createBuildingAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "post",
    data
  });
}

//编辑
export function updateBuildingAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "put",
    data
  });
}

//删除
export function deleteBuildingAPI(typeId) {
  return request({
    url: `${BASE_URL}/${typeId}`,
    method: "delete"
  });
}

//建筑信息详情
export function getBuildingDetailAPI(buildingId) {
  return request({
    url: `${BASE_URL}/${buildingId}`,
    method: "get"
  });
}

//获取待排序的列表
export function getBeforeSortListAPI(params) {
  return request({
    url: `${BASE_URL}/buildingList`,
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

//建筑层级
export function getBuildingLevelOptionsAPI(params) {
  return request({
    url: `${BASE_URL}/enums`,
    method: "get",
    params
  });
}

//房间功能枚举
export function getRoomFunctionOptionsAPI() {
  return request({
    url: `/energy/manage/functions/functionsEnum`,
    method: "get"
  });
}

//建筑类型
export function getBuildingTypeOptionsAPI() {
  return request({
    url: `/energy/manage/building/buildingTypeList`,
    method: "get"
  });
}

//部门树
export function getDepartmentTreeListsAPI() {
  return request({
    url: `/energy/manage/department/treeLists`,
    method: "get"
  });
}

//建筑字典
export function getBuildingDictionaryOptionsAPI() {
  return request({
    url: `/energy/buildingDictionary/list`,
    method: "get"
  });
}

//建筑层级 新
export function getBuildingLevelOptionsNewAPI(params) {
  return request({
    url: `${BASE_URL}/areaEnums`,
    method: "get",
    params
  });
}
