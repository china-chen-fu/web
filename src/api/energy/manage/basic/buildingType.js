import request from "@/utils/request";

const BASE_URL = "/energy/manage/buildingType";

//获取列表
export function getBuildingTypeAPI(params) {
  return request({
    url: `${BASE_URL}/list`,
    method: "get",
    params
  });
}

//新增
export function createBuildingTypeAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "post",
    data
  });
}

//编辑
export function updateBuildingTypeAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "put",
    data
  });
}

//删除
export function deleteBuildingTypeAPI(typeId) {
  return request({
    url: `${BASE_URL}/${typeId}`,
    method: "delete"
  });
}
