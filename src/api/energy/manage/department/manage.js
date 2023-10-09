import request from "@/utils/request";

const BASE_URL = "/energy/manage/department";

//获取列表
export function getDepartmentListAPI(params) {
  return request({
    url: `${BASE_URL}/list`,
    method: "get",
    params
  });
}

//新增
export function createDepartmentAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "post",
    data
  });
}

//编辑
export function updateDepartmentAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "put",
    data
  });
}

//删除
export function deleteDepartmentAPI(typeId) {
  return request({
    url: `${BASE_URL}/${typeId}`,
    method: "delete"
  });
}

//获取部门树
export function getDepartmentTreeListAPI(params) {
  return request({
    url: `${BASE_URL}/treeList`,
    method: "get",
    params
  });
}

//获取待排序的列表
export function getBeforeSortListAPI(params) {
  return request({
    url: `${BASE_URL}/allList`,
    method: "get",
    params
  });
}

export function commitAfterSortListAPI(data) {
  return request({
    url: `${BASE_URL}/editOrder`,
    method: "put",
    data
  });
}

// 根据部门名称获取部门列表
export function getDeptListByDeptNameAPI(data) {
  return request({
    url: `${BASE_URL}/nameAllList`,
    method: "get",
    params: data
  });
}

// 获取部门树 （只关联三级部门
export function getDeptTreeLevelTwoAPI(data) {
  return request({
    url: `${BASE_URL}/treeListsByBuilding`,
    method: "get",
    params: data
  });
}

// 设置结算截至日期
export function setSettlementEndTimeAPI(data) {
  return request({
    url: `/energy/manage/quota/settlement/time`,
    method: "put",
    data: data
  });
}