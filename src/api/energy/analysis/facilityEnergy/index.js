import request from "@/utils/request";

const BASE_URL = "/energy/analysis/facility";
//设施能耗统计
export function getAnalysisFacilityPageAPI(params) {
  return request({
    url: `${BASE_URL}/page`,
    method: "get",
    params
  });
}

//设施能耗总计
export function getAnalysisFacilitySummaryAPI(params) {
  return request({
    url: `${BASE_URL}/summary`,
    method: "get",
    params
  });
}

//设施查询树状图
export function getManageFacilityTreeAPI() {
  return request({
    url: `/energy/manage/building/tree`,
    method: "get"
  });
}

//设施用能占比
export function getFacilityRateAPI(data) {
  return request({
    url: `/energy/statistics/facility/getFacilityProportion`,
    method: "post",
    data: data
  });
}

//统计分析： 设施树
export function getFacilityTreeAPI(data) {
  return request({
    url: `/energy/manage/facility/getEnergyTree`,
    method: "get",
    params: data
  });
}

//统计分析： 时段用电汇总图
export function getSectionEnergySummaryAPI(data) {
  return request({
    url: `/energy/statistics/facility/getFacilitySummaryList`,
    method: "post",
    data: data
  });
}

//统计分析： 用电对比图
export function getEnergyCompareChartAPI(data) {
  return request({
    url: `/energy/statistics/facility/getFacilityContrastList`,
    method: "post",
    data: data
  });
}

//统计分析： table
export function getEnergyUsageAPI(data) {
  return request({
    url: `/energy/statistics/facility/getStatisticsEnergyUsage`,
    method: "post",
    data: data
  });
}

//统计分析： table合计
export function getEnergyUsageTotalAPI(data) {
  return request({
    url: `/energy/statistics/facility/getStatisticsTotalEnergyUsage`,
    method: "post",
    data: data
  });
}

//统计分析： table详情
export function getEnergyUsageTableDetailAPI(data) {
  return request({
    url: `/energy/statistics/facility/getBuildingStatisticsEnergyUsageDetail`,
    method: "post",
    data: data
  });
}
