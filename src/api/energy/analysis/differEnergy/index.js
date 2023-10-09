import request from "@/utils/request";

//建筑树状图
export function getManageBuildingTreeAPI() {
  return request({
    url: `/energy/manage/building/tree/five`,
    method: "get"
  });
}

//部门树状图
export function getManageDepartmentTreeAPI() {
  return request({
    url: `/energy/manage/department/treeLists`,
    method: "get"
  });
}

//用能差值
export function getAnalysisDifferencePageAPI(params) {
  return request({
    url: `/energy/analysis/difference/page`,
    method: "get",
    params
  });
}
