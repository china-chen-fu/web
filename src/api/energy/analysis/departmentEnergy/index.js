import request from "@/utils/request";

const BASE_URL = "/energy/analysis/department";
//部门能耗统计
export function getAnalysisDepartmentPageAPI(params) {
  return request({
    url: `${BASE_URL}/page`,
    method: "get",
    params
  });
}

//部门能耗总计
export function getAnalysisDepartmentSummaryAPI(params) {
  return request({
    url: `${BASE_URL}/summary`,
    method: "get",
    params
  });
}

//部门
export function getManageDepartmentTreeAPI() {
  return request({
    url: `/energy/manage/department/treeLists`,
    method: "get"
  });
}

//分项用能占比
export function getItemizeRateAPI(data) {
  return request({
    url: `/energy/statistics/dept/getDeptProportion`,
    method: "post",
    data: data
  });
}

//统计分析： 时段用电汇总图
export function getSectionEnergySummaryAPI(data) {
  return request({
    url: `/energy/statistics/dept/getSummaryListLineChart`,
    method: "post",
    data: data
  });
}

//统计分析： 用电对比图
export function getEnergyCompareChartAPI(data) {
  return request({
    url: `/energy/statistics/dept/getContrastList`,
    method: "post",
    data: data
  });
}

//统计分析： table
export function getEnergyUsageAPI(data) {
  return request({
    url: `/energy/statistics/dept/getStatisticsEnergyUsage`,
    method: "post",
    data: data
  });
}

//统计分析： table合计
export function getEnergyUsageTotalAPI(data) {
  return request({
    url: `/energy/statistics/dept/getStatisticsTotalEnergyUsage`,
    method: "post",
    data: data
  });
}
