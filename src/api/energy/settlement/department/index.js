import request from "@/utils/request";
//获取年份能源结算统计
export function getYearListApi(params) {
  return request({
    url: "/energy/manage/quota/yearList",
    method: "get",
    params
  });
}
//获取结算单位
export function getSettlementUnitApi() {
  return request({
    url: "/energy/manage/department/paymentTypeList",
    method: "get"
  });
}
// 获取结算详情列表
export function getSettlementDetailApi(params) {
  return request({
    url: "/energy/quotaPayment/quarterList",
    method: "get",
    params
  });
}
//新增季度结算
export function addQuarterApi(year) {
  return request({
    url: `/energy/quotaPayment/quarter/${year}`,
    method: "post"
  });
}
//结算调整
export function adjustApi(data) {
  return request({
    url: "/energy/quotaPayment/batch",
    method: "put",
    data
  });
}

//结算调整
export function settlementDeptApi(type, year) {
  return request({
    url: `/energy/quotaPayment/year/${type}/${year}`,
    method: "post",
  });
}

//完成结算
export function finishedSettlementApi(data) {
  return request({
    url: `/energy/quotaPayment/year/complete`,
    method: "put",
    data: data
  });
}
