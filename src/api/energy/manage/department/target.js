import request from "@/utils/request";
//获取年份经费统计
export function getYearListApi(params) {
  return request({
    url: "/energy/manage/quota/yearList",
    method: "get",
    params
  });
}
//根据选择年份查看详情
export function getTableDataApi(params) {
  return request({
    url: "/energy/manage/quota/list",
    method: "get",
    params
  });
}
//新增指标计划
export function creatTargetApi(data) {
  return request({
    url: "/energy/manage/quotaYear",
    method: "post",
    data
  });
}
//删除指标计划
export function deleteTargetApi(year) {
  return request({
    url: `/energy/manage/quotaYear/${year}`,
    method: "delete"
  });
}
//根据year获取部门结构
export function getDepartmentListApi(year) {
  return request({
    url: `/energy/manage/department/quotaList/${year}`,
    method: "get"
  });
}
//新增指标记录
export function createTargetItemApi(data) {
  return request({
    url: `/energy/manage/quota`,
    method: "post",
    data
  });
}
//删除指标记录
export function deleteTargetItemApi(id) {
  return request({
    url: `/energy/manage/quota/${id}`,
    method: "delete"
  });
}
//根据id获取指标基础信息
export function getTargetBaseDataApi(quotaId) {
  return request({
    url: `/energy/manage/quota/${quotaId}`,
    method: "get"
  });
}
//根据id更新指标基础数据
export function uploadTargetBaseDataApi(data) {
  return request({
    url: `/energy/manage/quota`,
    method: "put",
    data
  });
}
//根据id获取指标表格信息
export function getTargetTableDataApi(params) {
  return request({
    url: `/energy/manage/quotaDetails/list`,
    method: "get",
    params
  });
}
//修改指标人员指标
export function editPeopleTableDataApi(data) {
  return request({
    url: `/energy/manage/quotaDetails`,
    method: "put",
    data
  });
}
//删除人员指标指标
export function deletePeopleTableDataApi(id) {
  return request({
    url: `/energy/manage/quotaDetailsTwo/${id}`,
    method: "delete"
  });
}
//新增指标
export function creatNewTargetItemApi(data) {
  return request({
    url: `/energy/manage/quotaDetails`,
    method: "post",
    data
  });
}
//切换指标启用状态
export function changeItemCheckPaymentApi(data) {
  return request({
    url: `/energy/manage/quota`,
    method: "put",
    data
  });
}
