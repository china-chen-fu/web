import request from "@/utils/request";

const BASE_URL = "/energy/manage/facilityType";

//获取列表
export function getFacilityTypeListAPI(params) {
  return request({
    url: `${BASE_URL}/page`,
    method: "get",
    params
  });
}

//新增
export function createFacilityTypeAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "post",
    data
  });
}

//编辑
export function updateFacilityTypeAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "put",
    data
  });
}

//删除
export function deleteFacilityTypeAPI(typeId) {
  return request({
    url: `${BASE_URL}/${typeId}`,
    method: "delete"
  });
}

//排序
export function sortFacilityTypeAPI(data) {
  return request({
    url: `/energy/manage/facilityType/sort`,
    method: "post",
    data: data
  });
}
