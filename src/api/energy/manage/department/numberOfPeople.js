import request from "@/utils/request";
import uploadRequest from "@/utils/uploadRequest";
//获取年份人数统计
export function getYearListApi(params) {
  return request({
    url: "/energy/manage/quotaPeople/yearList",
    method: "get",
    params
  });
}
//根据选择年份查看详情
export function getTableDataApi(params) {
  return request({
    url: "/energy/manage/quotaPeople/list",
    method: "get",
    params
  });
}

//修改年份人数统计数据
export function changeTableDataApi(data) {
  return request({
    url: "/energy/manage/quotaPeople",
    method: "put",
    data
  });
}
//删除年份人数统计数据
export function deleteTableDataApi(id) {
  return request({
    url: `/energy/manage/quotaPeople/${id}`,
    method: "delete"
  });
}

//获取指标记录
export function getPeopleTargetListApi(params) {
  return request({
    url: `/energy/manage/quotaType/list`,
    method: "get",
    params
  });
}
//修改指标记录
export function changePeopleTargetApi(data) {
  return request({
    url: "/energy/manage/quotaType",
    method: "put",
    data
  });
}
//下载模板
export function downloadFileApi(data) {
  return request({
    url: "/energy/manage/quotaPeople/importTemplate",
    method: "post"
  });
}
//上传文件
export function uploadFileApi(data) {
  return uploadRequest({
    url: "/energy/manage/quotaPeople/import",
    method: "post",
    data
  });
}

//获取查看指标记录下部门列表
export function getCheckTypeApi() {
  return request({
    url: `/energy/manage/building/paymentTypeList`,
    method: "get"
  });
}
//获取查看指标记录下部门分类
export function getDepartmentTypeListApi(params) {
  return request({
    url: `/energy/manage/departmentType/list`,
    method: "get",
    params
  });
}
