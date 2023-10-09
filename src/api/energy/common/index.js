import request from "@/utils/request";

/**
 * 枚举
 */

//分组
export function getTypeGroupOptionsAPI() {
  return request({
    url: `energy/manage/buildingType/groupEnum`,
    method: "get"
  });
}

//获取建筑结构树
export function getBuildingTreeApi() {
  return request({
    url: `/energy/manage/building/tree/four`,
    method: "get"
  });
}
//根据id获取建筑子集
export function getBuildingTreeChildrenApi(params) {
  return request({
    url: `/energy/manage/room/list`,
    method: "get",
    params
  });
}
//部门分组枚举
export function getDepartmentGroupAPI() {
  return request({
    url: `/energy/manage/department/group`,
    method: "get"
  });
}

//指标化分类枚举
export function getDepartmentCheckTypeAPI() {
  return request({
    url: `/energy/manage/department/checkType`,
    method: "get"
  });
}
