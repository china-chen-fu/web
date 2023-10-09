import request from "@/utils/request";
import uploadRequest from "@/utils/uploadRequest";
//获取年份经费统计
export function getYearListApi(params) {
  return request({
    url: "/energy/manage/quotaFunds/yearList",
    method: "get",
    params
  });
}
//根据选择年份查看详情
export function getTableDataApi(params) {
  return request({
    url: "/energy/manage/quotaFunds/list",
    method: "get",
    params
  });
}

//修改年份经费统计数据
export function changeTableDataApi(data) {
  return request({
    url: "/energy/manage/quotaFunds",
    method: "put",
    data
  });
}
//删除年份经费统计数据
export function deleteTableDataApi(id) {
  return request({
    url: `/energy/manage/quotaFunds/${id}`,
    method: "delete"
  });
}
//下载模板
export function downloadFileApi(data) {
  return request({
    url: "/energy/manage/quotaFunds/importTemplate",
    method: "post"
  });
}
//上传文件
export function uploadFileApi(data) {
  return uploadRequest({
    url: "/energy/manage/quotaFunds/import",
    method: "post",
    data
  });
}
