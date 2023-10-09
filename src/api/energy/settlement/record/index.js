import request from "@/utils/request";
// 获取阶段汇总表格数据
export function getSettlementRecordApi(params) {
  return request({
    url: "/energy/quotaPayment/yearList",
    method: "get",
    params
  });
}

//获取结算时段
export function getSettlementTimeSectionApi(year) {
  return request({
    url: "/energy/manage/department/settle/cycle/" + year,
    method: "post",
  });
}

//获取结算导出树
export function getSettlementExportTreeApi() {
  return request({
    url: "/energy/manage/department/types",
    method: "get",
  });
}

//导出结算单
export function exportSettlementApi(data) {
  return request({
    url: "/energy/depart/export/settle/account/order",
    method: "post",
    responseType: "blob",
    data: data
  });
}

//导出结算记录
export function exportSettlementRecordApi(data) {
  return request({
    url: "/energy/quotaPayment/quarterYearExport",
    method: "post",
    responseType: "blob",
    data: data
  });
}

// 获取结算记录table
export function getSettlementRecordTableApi(params) {
  return request({
    url: "/energy/quota/payment/List",
    method: "get",
    params
  });
}