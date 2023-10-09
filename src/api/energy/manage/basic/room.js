import request from "@/utils/request";

const BASE_URL = "energy/manage/functions";

//获取列表
export function getRoomFunctionsAPI(params) {
  return request({
    url: `${BASE_URL}/list`,
    method: "get",
    params
  });
}

//新增
export function createRoomFunctionsAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "post",
    data
  });
}

//编辑
export function updateRoomFunctionsAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "put",
    data
  });
}

//删除
export function deleteRoomFunctionsAPI(typeId) {
  return request({
    url: `${BASE_URL}/${typeId}`,
    method: "delete"
  });
}
